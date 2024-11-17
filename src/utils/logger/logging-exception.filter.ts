import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Response, Request } from 'express';
  import { logger, formatLog } from './logger';
  
  @Catch()
  export class LoggingExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('Exception');
  
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
  
      const { method, url, headers, body } = request;
  
      const timestamp = new Date().toISOString();
      let statusCode = 500;
      let errorResponse: any = {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode,
      };
  
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        const httpResponse = exception.getResponse();
        errorResponse =
          typeof httpResponse === 'string'
            ? { message: httpResponse }
            : httpResponse;
      } else if (exception instanceof Error) {
        errorResponse = {
          message: exception.message,
          error: exception.name,
          statusCode,
        };
      }
  
      const logMessage = formatLog({
        method,
        url,
        headers,
        body,
        status: statusCode,
        responseTime: undefined,
        responseBody: errorResponse,
      });
  
      logger.error(logMessage);
  
      response.status(statusCode).json(errorResponse);
    }
  }
  