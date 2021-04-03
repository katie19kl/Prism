import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';


@Injectable()
export class IsEmptyGuard implements CanActivate {

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {

		console.log("I am in Empty guard(in users)");
		let text = context.switchToHttp().getRequest();
		let bodyRequest = text.body;

		let personalId = bodyRequest.personalId;
		let password = bodyRequest.password;
		let username = bodyRequest.username;
        let role = bodyRequest.role;
		let firstName = bodyRequest.firstName;
		let lastName = bodyRequest.lastName;
		let gender = bodyRequest.gender;

				
		// Lack of necessary fields.
		if ((password === undefined) || (username === undefined) 
			|| (role === undefined) || (firstName === undefined) 
			|| (lastName === undefined) || (gender === undefined)
			|| (personalId === undefined)) {

			return false;
		
		}

		return true;
	}
}