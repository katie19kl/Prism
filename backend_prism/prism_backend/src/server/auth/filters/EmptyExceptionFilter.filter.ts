import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class EmptyExceptionFilter<T> implements ExceptionFilter {
	
	catch(exception: ForbiddenException, host: ArgumentsHost) {
		console.log("in filter & redirection to /hello");
		
		const status =
		exception instanceof HttpException
			? exception.getStatus()
			: UserNotFoundException.NotFound;

		const x = exception.getStatus()

		// forbidden from guard
		if (exception.getStatus() == 403){
			console.log("403")
		}

		// not found
		if (exception.getStatus() == 404){
			console.log("404")
		}

		host.switchToHttp().getResponse().redirect("/hello");  
	}
}