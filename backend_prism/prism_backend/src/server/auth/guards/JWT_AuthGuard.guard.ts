import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  	canActivate(context: ExecutionContext) {

    	// if false => redirects to login.
        return super.canActivate(context); // requires auth token
  	}
}