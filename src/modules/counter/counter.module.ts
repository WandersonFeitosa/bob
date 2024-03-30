import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CounterController } from './counter.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
