// logger.module.ts
import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from 'src/infrastructure/interceptors/request-logger.interceptor';



@Global()
@Module({
    providers: [
        LoggerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestLoggerInterceptor,
        },
    ],
    exports: [LoggerService],
})
export class LoggerModule { }
