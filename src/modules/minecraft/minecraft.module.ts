import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BobModule } from '../bob/bob.module';
import { ManagerProxy } from 'src/infrastructure/proxy/manager.proxy';

@Module({
  imports: [PrismaModule, BobModule],
  controllers: [MinecraftController],
  providers: [MinecraftService, ManagerProxy],
})
export class MinecraftModule {}
