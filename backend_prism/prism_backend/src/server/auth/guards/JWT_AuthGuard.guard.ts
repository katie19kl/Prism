import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
<<<<<<< HEAD
  canActivate(context: ExecutionContext) {


    // if false => redirects to login or bye bye
    console.log("In JWT  guard expectes to see JWT token")
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    
    //return true; // return 201
    return super.canActivate(context); // requires auth token 
  }

=======
  
>>>>>>> 0ab74d62f603ca374449e40ee452d9c29e7c0090
}