import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../exception/UserNotFound.exception';

@Catch()
export class NoJWTFilter<T> implements ExceptionFilter {// Was received 401
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {

		const x = exception.getStatus()
    console.log("IN JWT FILTER")
    const response = host.switchToHttp().getResponse();

    const status = (exception instanceof HttpException) ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json({
        exception,
        xui: "gggggggggggggggggggggggggggggggggggg"
      });
   
    /////////////////////////////////1//

	}
}