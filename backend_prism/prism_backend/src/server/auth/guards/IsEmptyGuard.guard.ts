import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsEmptyGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {

    console.log("I am in Empty guard");
    let text = context.switchToHttp().getRequest();
    let body_request = text.body;

    let password = body_request.password

    let user_name = body_request.username

    if (password == "1-2"){
      return false;
    }


    return false;
  }
}
