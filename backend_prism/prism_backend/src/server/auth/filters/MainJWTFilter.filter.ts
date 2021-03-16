import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class MainJWTFilter<T> implements ExceptionFilter {// Was received 401
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

    console.log("NO jwt Filter & redirection to auth/user")
		host.switchToHttp().getResponse().redirect("/hello");
	
    //host.switchToHttp().getResponse().redirect("/auth/user");
	}
}