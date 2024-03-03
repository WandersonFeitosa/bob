import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new HttpException('Token not found', 401);
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw new HttpException('Invalid token type', 401);
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return true;
    } catch (error) {
      throw new HttpException('Invalid token', 401);
    }
  }
}
