import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';
import { Request, Response } from 'express';

@Catch()
export class EmptyExceptionFilter<T> implements ExceptionFilter {
	
	catch(exception: ForbiddenException, host: ArgumentsHost) {
		
		const status =
		exception instanceof HttpException
			? exception.getStatus()
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
			});

		// forbidden from guard - did not enter all the required fields.
		if (exception.getStatus() == 403) {
			console.log("403") // forbidden.
		}

		// not found - the user does not exist.(keep it that way).
		if (exception.getStatus() == 404) {
			console.log("404") // not found.
		}

	}
}