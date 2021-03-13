import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/server/users/iuser.interface';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any | undefined> {

        // This will be used for the initial login
        let userToAttempt: IUser | undefined;
        userToAttempt = await this.usersService.findOneByUsername(loginAttempt.username);
        
        let isMatch = false;

        try {
            isMatch = await userToAttempt.checkPassword(loginAttempt.password);

        } catch (error) {

          return undefined;
        
        }
        
        if (isMatch) {

            // If there is a successful match, generate a JWT for the user
            const result = this.createJwtPayload(userToAttempt);
            
            return result;
        }
      
        return undefined;
    }

    async validateUserByJwt(payload: JwtPayload) { 

        // This will be used when the user has already logged in and has a JWT
        let user = await this.usersService.findOneByUsername(payload.username);

        if (user) {

            return this.createJwtPayload(user);

        } else {

            throw new UnauthorizedException();
        
        }
    }

    createJwtPayload(user) {

        let data: JwtPayload = {
            username: user.username
        };

        let jwt = this.jwtService.sign(data);

        return {
            expiresIn: 3600,
            token: jwt
        }
    }
}