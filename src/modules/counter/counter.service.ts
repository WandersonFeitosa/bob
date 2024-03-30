import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterCountDTO, RegisterMultiplier } from './dto/input-counter-dto';
import { DiscordMultipliers, Progress } from '@prisma/client';

@Injectable()
export class CounterService {
  private id = 'e8a4e0b8-4f33-4675-8f03-565a71411d1c';
  constructor(private prisma: PrismaService) {}

  async getCount(): Promise<any> {
    try {
      const count = await this.prisma.progress.findUnique({
        where: {
          id: this.id,
        },
      });
      const multipliers = await this.prisma.discordMultipliers.findMany();
      return {
        count: count?.progess,
        multipliers,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async updateCount(dto: RegisterCountDTO): Promise<any> {
    try {
      const count = await this.prisma.progress.update({
        where: {
          id: this.id,
        },
        data: {
          progess: dto.count,
        },
      });

      const multipliers = await this.prisma.discordMultipliers.findMany();

      return {
        count: count?.progess,
        multipliers,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  async getMultipliers() {
    try {
      return await this.prisma.discordMultipliers.findMany();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  async registerMultiplier(
    dto: RegisterMultiplier,
  ): Promise<DiscordMultipliers> {
    try {
      const user = await this.prisma.discordMultipliers.findFirst({
        where: {
          OR: [{ username: dto.username }, { email: dto.email }],
        },
      });
      if (user) {
        return await this.prisma.discordMultipliers.update({
          where: {
            id: user.id,
          },
          data: dto,
        });
      }
      return await this.prisma.discordMultipliers.create({
        data: dto,
      });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
