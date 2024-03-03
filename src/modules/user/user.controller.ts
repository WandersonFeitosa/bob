import { Body, Controller, Get, Headers, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/input-user-dto';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Post('/auth')
  async login(@Headers('authorization') authorization: string) {
    return await this.userService.login(authorization);
  }
}
