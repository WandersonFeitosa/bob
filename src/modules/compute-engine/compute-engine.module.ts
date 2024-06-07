import { Module } from '@nestjs/common';
import { ComputeEngineService } from './compute-engine.service';
import { ComputeEngineControler } from './compute-engine.controller';
@Module({
  providers: [ComputeEngineService],
  controllers: [ComputeEngineControler],
  exports: [ComputeEngineService],
})
export class ComputeEngineModule {}
