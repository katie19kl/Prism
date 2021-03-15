import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class NoJWTFilter<T> implements ExceptionFilter {//401
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

		
		const status =
		exception instanceof HttpException
			? exception.getStatus()
			: UserNotFoundException.NotFound;

		const x = exception.getStatus()
    console.log("IN JWT FILTER")
    ////////////////////////////////////

    ///////////////////////////////////

	}
}