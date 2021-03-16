import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException,
	 HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';
import { Request, Response } from 'express';

@Catch()
export class NoJWTFilter<T> implements ExceptionFilter {//401
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

		
		const status =
		exception instanceof HttpException
			? exception.getStatus()
			: UserNotFoundException.NotFound;

    	console.log("IN JWT FILTER");
    ////////////////////////////////////

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

    ///////////////////////////////////

	}
}