import { Controller, Get, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MinecraftService } from './minecraft.service';

@Controller('v1/minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('/health')
  @Cron(CronExpression.EVERY_10_SECONDS)
  async health() {
    return await this.minecraftService.health();
  }

  @Post('/start')
  async status() {
    return await this.minecraftService.startServer();
  }
}
