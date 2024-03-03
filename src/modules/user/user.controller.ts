import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/input-user-dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Post('/auth')
  async login(@Headers('authorization') authorization: string) {
    return await this.userService.login(authorization);
  }
}
