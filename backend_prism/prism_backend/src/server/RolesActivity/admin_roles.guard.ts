
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("in admin roles guard ! ")
    
    
    let text = context.switchToHttp().getRequest();
		let body_request = text.body;
    let role = body_request.role
    
    let res = (role == Role.Admin)
    
    return res
  }
}
