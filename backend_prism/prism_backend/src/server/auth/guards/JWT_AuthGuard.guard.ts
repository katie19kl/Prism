import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {


    // if false => redirects to login or bye bye
    console.log("In JWT  guard expectes to see JWT token")
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
   // console.log(context)
    //return true; // return 201
    return super.canActivate(context); // requires auth token
  }

}