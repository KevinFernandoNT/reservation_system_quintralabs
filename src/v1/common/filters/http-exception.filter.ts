import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        let error = exception instanceof HttpException ? exception.name : 'Internal Server Error';

        // Handle TypeORM/Postgres Errors
        if (exception instanceof QueryFailedError) {
            const dbError = exception as any;
            // Postgres error code 23P01 is for exclusion_violation (used by GIST index for overlaps)
            if (dbError.code === '23P01') {
                status = HttpStatus.CONFLICT;
                message = 'The resource is already reserved for this time slot, Please select another time slot';
                error = 'ConflictException';
            } else if (dbError.code === '23505') {
                // Unique violation
                status = HttpStatus.CONFLICT;
                message = 'Conflict: Dynamic constraint violation (Duplicate entry)';
                error = 'ConflictException';
            } else if (dbError.code === '22P02') {
                status = HttpStatus.BAD_REQUEST;
                message = 'Invalid UUID format';
                error = 'BadRequestException';
            } else {
                this.logger.error(`Database Error: ${exception.message}`, exception.stack);
            }
        }

        const errorResponse = {
            statusCode: status,
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: (message as any).message || message,
            error: (message as any).error || error,
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
