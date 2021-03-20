import { Controller, Post, Body, UseGuards, Get, NotFoundException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'
import { IsEmptyGuard } from './guards/IsEmptyGuard.guard';
import { EmptyExceptionFilter } from './filters/EmptyExceptionFilter.filter';
import { UseFilters } from '@nestjs/common';
import { UserNotFoundException } from './exception/UserNotFound.exception';
import { JwtAuthGuard } from './guards/JWT_AuthGuard.guard';
import { NoJWTFilter } from './filters/NoJWTFilter.filter';


@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}

    @Get("validate")
    @UseGuards(JwtAuthGuard)
    @UseFilters(NoJWTFilter)
    async tokenValidator(@Res() res) {

        console.log("in JWT");

        return res.json({ isValid: true});
        
    }

    
    @Post('user')
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