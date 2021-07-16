import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class Role_Guard implements CanActivate {
  constructor(private readonly reflector: Reflector,
             @Inject('UsersService') private readonly userService: UsersService) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    
    
    let request_ = context.switchToHttp().getRequest();
    const userToken = request_.headers.authorization;
    
    let user_ = await this.userService.getUserByJWT(userToken);
    if (user_ === undefined){
        return false
    }

	
	const roles = this.reflector.get<string[]>('roles', context.getHandler());
	if (roles === undefined) {
		return true;
	}

    let currRole = user_.role;

    console.log("----------------")
    console.log(roles)
    console.log(roles.includes(currRole))
    console.log(currRole)
    console.log("----------------")
    
    return roles.includes(currRole)

    
  }
}