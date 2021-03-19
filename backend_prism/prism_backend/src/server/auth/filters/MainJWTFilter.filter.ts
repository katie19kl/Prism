import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class MainJWTFilter<T> implements ExceptionFilter {// Was received 401
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

    console.log("NO jwt Filter & wants refirection to log in")
    

    const response = host.switchToHttp().getResponse();

    const status = (exception instanceof HttpException) ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json({
        exception,
        msg: "Please make a log in first"
      });
		//host.switchToHttp().getResponse().redirect("/hello");
	
    //host.switchToHttp().getResponse().redirect("/auth/user");
	}
}