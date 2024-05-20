import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BobModule } from '../bob/bob.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CounterModule } from '../counter/counter.module';
import { MinecraftModule } from '../minecraft/minecraft.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BobModule,
    UserModule,
    PrismaModule,
    CounterModule,
    MinecraftModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
