import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { Role } from './role.enum';


@Injectable()
export class AdminCommanderRolesGuard implements CanActivate {

  	constructor(private reflector: Reflector, 
				@Inject('UsersService') private readonly userService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		console.log("in AdminCommanderRolesGuard roles guard!")

		let request = context.switchToHttp().getRequest();

		const userToken = request.headers.authorization;
		
		let user = await this.userService.getUserByJWT(userToken);
		if (user === undefined){
            return false
        }

		let currRole = user.role;

		let res = (currRole == Role.Admin || currRole == Role.Commander)
		
		return res;
	}


}
