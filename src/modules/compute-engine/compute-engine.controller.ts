import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ComputeEngineService } from './compute-engine.service';
import { GetInstancesDTO } from './dto/compute-engine.dto';

@Controller('/v1/compute')
export class ComputeEngineControler {
  constructor(private readonly computeEngineService: ComputeEngineService) {}

  @Get('/instances')
  async getInstances(@Body() dto: GetInstancesDTO) {
    return await this.computeEngineService.getInstances(dto);
  }
}
