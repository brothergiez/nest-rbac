import * as winston from 'winston';

const sensitiveFields = ['password', 'token', 'authorization'];

function sanitize(data: any): any {
  if (!data || typeof data !== 'object') return data;

  return Object.keys(data).reduce((acc, key) => {
    acc[key] = sensitiveFields.includes(key.toLowerCase()) ? '******' : data[key];
    return acc;
  }, {});
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),
  ],
});

export function formatLog({
  method,
  url,
  headers,
  body,
  status,
  responseTime,
  responseBody,
}: {
  method: string;
  url: string;
  headers: any;
  body: any;
  status?: number;
  responseTime?: number;
  responseBody?: any;
}): string {
  return `${method} ${url} | Headers: ${JSON.stringify(sanitize(headers))} | Body: ${JSON.stringify(
    sanitize(body),
  )} | Response: ${JSON.stringify(sanitize(responseBody))} | Status: ${status} | Time: ${
    responseTime !== undefined ? `${responseTime}ms` : '-'
  }\n`; 
}