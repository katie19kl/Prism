import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';

@Catch()
export class EmptyExceptionFilter<T> implements ExceptionFilter {
  
  
  catch(exception: ForbiddenException, host: ArgumentsHost) 
  {
    console.log("in filter");
    host.switchToHttp().getResponse().redirect("/hello");  
  }
}
