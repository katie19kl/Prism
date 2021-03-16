import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class EmptyExceptionFilter<T> implements ExceptionFilter {
	
	catch(exception: ForbiddenException, host: ArgumentsHost) {
		console.log("in filter & redirection to /hello");
		
		const status =
		exception instanceof HttpException
			? exception.getStatus()
			: UserNotFoundException.NotFound;

		// forbidden from guard - did not enter all the required fields.
		// SHOULD CHANGE TO 400=BAD REQUEST!!!!!
		if (exception.getStatus() == 403) {
			console.log("403") // forbidden.
		}

		// not found - the user does not exist.(keep it that way).
		if (exception.getStatus() == 404) {
			console.log("404") // not found.
		}

		host.switchToHttp().getResponse().redirect("/hello");
	}
}