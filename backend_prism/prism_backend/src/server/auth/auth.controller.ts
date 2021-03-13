import { Controller, Post, Body, UseGuards, Get, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'
import { IsEmptyGuard } from './guards/IsEmptyGuard.guard';
import { EmptyExceptionFilter } from './filters/EmptyExceptionFilter.filter';
import { UseFilters } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    @Post()
    @UseGuards(IsEmptyGuard)
    @UseFilters(new EmptyExceptionFilter())
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

        console.log("auth controller")
        console.log(loginUserDto); // to be deleted!

        const result = await this.authService.validateUserByPassword(loginUserDto);

        if (result) {

            return result;

        } else {

            console.log("an exception has occured");
            //return new UnauthorizedException('Unauthorized');
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}