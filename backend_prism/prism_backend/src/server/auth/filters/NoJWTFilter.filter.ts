import { UserNotFoundException } from '../exception/UserNotFound.exception';
import { Request, Response } from 'express';
import { 
	ArgumentsHost, 
	Catch, 
	ExceptionFilter,
	HttpException, 
	UnauthorizedException 
} from '@nestjs/common';


@Catch()
export class NoJWTFilter<T> implements ExceptionFilter {
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

		const status = exception instanceof HttpException ? exception.getStatus()
			: UserNotFoundException.NotFound;

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const currStatus = exception.getStatus();

		response
		.status(currStatus)
		.json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			isValid: false,
		});
	}
}