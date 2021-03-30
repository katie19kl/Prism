import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/server/users/iuser.interface';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { jwtStaticRandomSTR } from '../RolesActivity/constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any | undefined> {

        // This will be used for the initial login
        let userToAttempt: IUser | undefined;
        userToAttempt = await this.usersService.findOneByUsername(loginAttempt.username);
        
        // username does not exist
        if (userToAttempt == null) {
            return undefined;
        }

        let isMatch = false;

        try {
            // passport is right
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

    async createJwtPayload(user) {
        let userObj = await this.usersService.findOneByUsername(user.username);
        // Generates rand||CurrentTime
        // new string per server activating
        let str = jwtStaticRandomSTR.stringRandomTime
        console.log(str + '\\n-------')


        let data: JwtPayload = {
            // adding randomality
            username: user.username,  //+ jwtStaticRandomSTR.stringRandomTime
            role: userObj.role
        };

        let jwt = this.jwtService.sign(data);
        return {
            expiresIn: 30000,
            token: jwt
        }
    }



}