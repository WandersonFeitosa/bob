import { Module } from '@nestjs/common';
import { BobController } from './bob.controller';
import { BobService } from './bob.service';

@Module({
  controllers: [BobController],
  providers: [BobService],
})
export class BobModule {}
