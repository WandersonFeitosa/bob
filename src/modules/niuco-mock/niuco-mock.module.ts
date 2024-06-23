import { Module } from '@nestjs/common';
import { NiucoMockService } from './niuco-mock.service';
import { NiucoMockController } from './niuco-mock.controller';

@Module({
  controllers: [NiucoMockController],
  providers: [NiucoMockService],
})
export class NiucoMockModule {}
