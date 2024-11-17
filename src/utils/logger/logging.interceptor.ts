import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { logger, formatLog } from './logger';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest();
      const response = httpContext.getResponse();
  
      const { method, url, headers, body } = request;
      const startTime = Date.now();
  
      return next.handle().pipe(
        tap((resBody) => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - startTime;
  
          const logMessage = formatLog({
            method,
            url,
            headers,
            body,
            status: statusCode,
            responseTime,
            responseBody: resBody,
          });
  
          logger.info(logMessage);
        }),
      );
    }
  }
  