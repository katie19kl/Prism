import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post() 
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

        console.log(loginUserDto); // to be deleted!

        const result = await this.authService.validateUserByPassword(loginUserDto);

        if (result) {

            return result;

        } else {

            return new UnauthorizedException('You are unauthorized');
        
        }
    }
}