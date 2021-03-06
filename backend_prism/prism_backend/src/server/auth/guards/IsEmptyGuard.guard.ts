import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserDto } from 'src/server/users/dto/create-user.dto';
import { IUser } from 'src/server/users/iuser.interface';




@Injectable()
export class IsEmptyGuard implements CanActivate {

	
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {

		console.log("I am in Empty guard");
		let text = context.switchToHttp().getRequest();
		let body_request = text.body;

		let password = body_request.password
		
		let user_name = body_request.username
				
		// Invalid input.
		if ((password === undefined) || (user_name === undefined)) {
			return false;
		}

		return true;
	}
}
