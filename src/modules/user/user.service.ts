import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/input-user-dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO): Promise<void> {
    const checkUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
        NOT: {
          delete: true,
        },
      },
    });
    if (checkUser) {
      throw new HttpException('O email já está sendo utilizado', 409);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    dto.password = hashedPassword;

    await this.prisma.user.create({
      data: dto,
    });

    return;
  }

  async login(authorization: string): Promise<{
    access_token: string;
  }> {
    const [type, token] = authorization.split(' ');
    if (type !== 'Basic') {
      throw new HttpException('Tipo de autorização inválido', 400);
    }
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decodedToken.split(':');

    const user = await this.prisma.user.findUnique({
      where: {
        email,
        NOT: {
          delete: true,
        },
      },
    });
    if (!user) {
      throw new HttpException('Usuário ou Senha inválido', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Usuário ou Senha inválido', 401);
    }

    const { password: _, ...userData } = user as any;

    return {
      access_token: this.generateToken(userData),
    };
  }

  generateToken(data: any): string {
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }
}
