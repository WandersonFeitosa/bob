import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BobModule } from '../bob/bob.module';

@Module({
  imports: [PrismaModule, BobModule],
  controllers: [MinecraftController],
  providers: [MinecraftService],
})
export class MinecraftModule {}
