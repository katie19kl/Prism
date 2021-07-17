import { 
	ArgumentsHost,
	Catch, ExceptionFilter, 
	HttpException, 
	HttpStatus, 
	UnauthorizedException 
} from '@nestjs/common';


@Catch()
export class MainJWTFilter<T> implements ExceptionFilter {
	
	catch(exception: UnauthorizedException, host: ArgumentsHost) {
		
		const response = host.switchToHttp().getResponse();
		const status = (exception instanceof HttpException) ? exception.getStatus() 
			: HttpStatus.INTERNAL_SERVER_ERROR;

		response
		.status(status)
		.json({
			exception,
			msg: "Please make a log in first"
		});
	}
}