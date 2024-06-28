import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class LoggerService {
  private _globalTransactionId: string;
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        this.customFormat(),
      ),
      transports: [new transports.Console()],
    });
  }

  public set globalTransactionId(globalTransactionId: string) {
    this._globalTransactionId = globalTransactionId;
  }

  private customFormat() {
    return format.printf(({ message, timestamp, ...params }) => {
      const paramsString = Object.keys(params).length
        ? ` - ${JSON.stringify(params)}`
        : '';
      return `${timestamp} ${this._globalTransactionId
          ? `[GlobalTransactionID - ${this._globalTransactionId}] `
          : ''
        }${message}${paramsString}`;
    });
  }

  logging(level: string, message: string, params: Record<string, any> = {}) {
    this.logger.log({
      level,
      message,
      ...params,
    });
  }
  public error(message?: any, params: Record<string, any> = {}): void {
    this.logging('error', message, params);
  }

  public debug(message?: any, params: Record<string, any> = {}): void {
    this.logging('debug', message, params);
  }

  public warn(message?: any, params: Record<string, any> = {}): void {
    this.logging('warn', message, params);
  }

  public help(message?: any, params: Record<string, any> = {}): void {
    this.logging('help', message, params);
  }

  public info(message?: any, params: Record<string, any> = {}): void {
    this.logging('info', message, params);
  }

  public log(message?: any, params: Record<string, any> = {}): void {
    this.logging('info', message, params);
  }
}
