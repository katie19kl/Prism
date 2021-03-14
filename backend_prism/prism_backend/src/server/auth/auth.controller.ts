import { Controller, Post, Body, UseGuards, Get, HttpStatus, HttpException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'
import { IsEmptyGuard } from './guards/IsEmptyGuard.guard';
import { EmptyExceptionFilter } from './filters/EmptyExceptionFilter.filter';
import { UseFilters, Request } from '@nestjs/common';
import { UserNotFoundException } from './exception/UserNotFound.exception';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/LocalAuthGuard.guard';
import { JwtAuthGuard } from './guards/JWT_AuthGuard.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}



    @Get("helloJWT")
    @UseGuards(JwtAuthGuard)
    async try(@Request() req){
        return " hello JWT"
    }


    @Post('user')
    //@Get("sign_in")
    @UseGuards(IsEmptyGuard)
    @UseFilters(new EmptyExceptionFilter())
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

        console.log("auth controller")
        console.log(loginUserDto); // to be deleted!

        // JWT token
        const resultJWTtoken = await this.authService.validateUserByPassword(loginUserDto);

        if (resultJWTtoken) {

            return resultJWTtoken;

        } else {

            console.log("Unauthorized an exception has occured");
            throw new NotFoundException(UserNotFoundException.NotFound);
            
        }
    }
}