import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BobModule } from '../bob/bob.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [BobModule, ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
