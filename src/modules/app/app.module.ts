import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BobModule } from '../bob/bob.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinecraftModule } from '../minecraft/minecraft.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from '../file/file.module';
import { ComputeEngineModule } from '../compute-engine/compute-engine.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BobModule,
    PrismaModule,
    MinecraftModule,
    FileModule,
    ComputeEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
