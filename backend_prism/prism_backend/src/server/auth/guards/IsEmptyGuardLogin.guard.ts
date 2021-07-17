import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';


@Injectable()
export class IsEmptyGuardLogin implements CanActivate {

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {

		let text = context.switchToHttp().getRequest();
		let bodyRequest = text.body;

		let password = bodyRequest.password;		
		let userName = bodyRequest.username;
				
		// Lack of  fields.
		if ((password === undefined) || (userName === undefined)) {
			return false;
		}

		let lenPassword = password.length;
		let lenUsername = userName.length;

		// Empty fields
		if (lenPassword <= 0 || lenUsername <= 0) {
			return false;
		}

		return true;
	}
}