import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {


    // if false => redirects to login or bye bye
    console.log("In JWT  guard expectes to see JWT token")
    
    //return true; // return 201
    return super.canActivate(context); // requires auth token
  }

}