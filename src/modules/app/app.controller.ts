import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  healthWolks() {
    return this.appService.healthWolks();
  }
}
