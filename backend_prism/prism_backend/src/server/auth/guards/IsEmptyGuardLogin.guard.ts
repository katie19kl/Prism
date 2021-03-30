import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsEmptyGuardLogin implements CanActivate {

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {

		console.log("I am in Empty guard!(in auth, login)");
		let text = context.switchToHttp().getRequest();
		let body_request = text.body;

		let password = body_request.password;
		
		let user_name = body_request.username;
				
		// Lack of  fields.
		if ((password === undefined) || (user_name === undefined)) {
			return false;
		}

		let len_password = password.length
		let len_username = user_name.length

		// Empty fields
		if (len_password <= 0 || len_username <= 0){
			return false;
		}

		return true;
	}
}