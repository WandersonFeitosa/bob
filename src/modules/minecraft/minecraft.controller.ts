import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MinecraftService } from './minecraft.service';

@Controller('v1/minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('/health')
  @Cron(CronExpression.EVERY_30_SECONDS)
  async health() {
    return await this.minecraftService.health();
  }

  @Patch('/update-status')
  async updateStatus(@Body() dto: { status: string }) {
    return await this.minecraftService.updateStatus(dto);
  }

  @Post('/start-backup')
  @Cron('0 7 * * *')
  async startBackup() {
    return await this.minecraftService.startBackup();
  }

  @Post('/start')
  async status() {
    return await this.minecraftService.startServer();
  }

  @Get('/server-logs')
  @Cron(CronExpression.EVERY_10_SECONDS)
  async serverLogs() {
    if (process.env.NODE_ENV === 'develop') return;
    return await this.minecraftService.getServerLogs();
  }
}
