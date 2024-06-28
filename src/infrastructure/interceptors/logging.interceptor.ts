import {
  Logger,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as crypto from 'crypto';
import { UuidUtil } from 'src/utils/uuid';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  private generateHash(data: string): string {
    const hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const uuid = UuidUtil.generate();
    request.uuid = uuid;

    const controllerName = context.getClass().name;
    const handler = context.getHandler();
    const methodName = handler ? handler.name : '';
    const method = `${controllerName}.${methodName}`;

    const url = request.originalUrl || request.url;

    this.logger.log(`[${uuid}] Executing method.`, method);
    this.logger.log(`[${uuid}] URL: ${url}`, method); // Log da URL chamada
    const now = Date.now();

    const requestData = JSON.stringify(request.body) || '';

    this.logger.log(`[${uuid}] Request body: ${requestData}`, method); // Log do corpo da solicitação

    return next.handle().pipe(
      tap((data) => {
        if (data) {
          const responseData = JSON.stringify(data) || '';
          this.logger.log(`[${uuid}] Response body: ${responseData}`, method); // Log do corpo da resposta
        }

        this.logger.log(
          `[${uuid}] Method executed in ${Date.now() - now} ms.`,
          method,
        );
      }),
      catchError((error) => {
        if (error instanceof HttpException) {
          const httpError = error;
          const responseMessage: string | Record<string, any> =
            httpError.getResponse();

          if (responseMessage && typeof responseMessage === 'string') {
            const responseHash = this.generateHash(responseMessage);
            this.logger.error(
              `[${uuid}] Error ${httpError.getStatus()} response: ${responseHash}`,
              error.stack,
              method,
            );
          } else if (
            responseMessage &&
            typeof responseMessage === 'object' &&
            responseMessage.transaction
          ) {
            const errorCode = responseMessage.httpCode || 'N/A';
            const errorMessage = responseMessage.httpMessage || 'N/A';
            const transactionId =
              responseMessage.transaction.localTransactionId || 'N/A';
            this.logger.error(
              `[${uuid}] Error ${errorCode} response: ${errorMessage}, Transaction ID: ${transactionId}`,
              error.stack,
              method,
            );
          } else {
            this.logger.error(
              `[${uuid}] Error ${httpError.getStatus()} response: ${JSON.stringify(responseMessage)}`,
              error.stack,
              method,
            );
          }
        } else {
          this.handleException(error, uuid, method);
        }
        throw error;
      }),
    );
  }

  private handleException(error: any, uuid: string, method: string): void {
    if (error instanceof HttpException) {
      const httpError = error;
      this.logger.error(
        `[${uuid}] HTTP Exception: ${httpError.getStatus()} - ${JSON.stringify(httpError.getResponse())}`,
        null,
        method,
      );
    } else if (error instanceof Error) {
      this.logger.error(
        `[${uuid}] Exception: ${error.message}`,
        error.stack,
        method,
      );
    } else {
      this.logger.error(
        `[${uuid}] Unhandled Exception: ${JSON.stringify(error)}`,
        null,
        method,
      );
    }
  }
}
