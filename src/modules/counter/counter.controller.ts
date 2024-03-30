import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';

import { CounterService } from './counter.service';
import { RegisterCountDTO, RegisterMultiplier } from './dto/input-counter-dto';

@Controller('v1/counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get()
  async getCount() {
    return await this.counterService.getCount();
  }

  @Put()
  async registerCount(@Body() dto: RegisterCountDTO) {
    return await this.counterService.updateCount(dto);
  }

  @Get('/multiplier')
  async getMultipliers() {
    return await this.counterService.getMultipliers();
  }
  @Post('/multiplier')
  async registerMultiplier(@Body() dto: RegisterMultiplier) {
    return await this.counterService.registerMultiplier(dto);
  }
}
