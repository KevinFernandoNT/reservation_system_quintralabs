import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        const errorResponse = {
            statusCode: status,
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: (message as any).message || message,
            error: (message as any).error || (exception instanceof HttpException ? exception.name : 'Internal Server Error'),
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${request.method} ${request.url}`,
                exception.stack,
                'HttpExceptionFilter',
            );
        } else {
            this.logger.warn(
                `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(
                    errorResponse.message,
                )}`,
            );
        }

        response.status(status).json(errorResponse);
    }
}
