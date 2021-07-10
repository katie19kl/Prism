import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class SoldierRolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		console.log("in user roles guard ! ")
		
		let text = context.switchToHttp().getRequest();
		let body_request = text.body;
		let role = body_request.role;
		
		let res = (role == Role.Soldier);
		
		return res;
	}
}
