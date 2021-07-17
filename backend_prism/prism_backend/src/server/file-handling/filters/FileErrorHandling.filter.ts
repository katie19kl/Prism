import { 
	ArgumentsHost, 
	Catch, 
	ExceptionFilter, 
	ForbiddenException 
} from '@nestjs/common';
import { Request, Response } from 'express';


@Catch()
export class FileErrorHandling<T> implements ExceptionFilter {
	
	catch(exception: ForbiddenException, host: ArgumentsHost) {
		
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const currStatus = exception.getStatus();
	
		response
		.status(currStatus)
		.json({
			statusCode: 500,
			timestamp: new Date().toISOString(),
			path: request.url,
		});

		// forbidden from guard - did not enter all the required fields.
		if (exception.getStatus() == 403) {
			console.log("403") // forbidden.
		}

		// not found - the user does not exist.
		if (exception.getStatus() == 404) {
			console.log("404") // not found.
		}
	}
}