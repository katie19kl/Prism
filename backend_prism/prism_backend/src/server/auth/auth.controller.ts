import { Controller, Post, Body, UseGuards, Get, NotFoundException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'
import { IsEmptyGuardLogin } from './guards/IsEmptyGuardLogin.guard';
import { EmptyExceptionFilter } from './filters/EmptyExceptionFilter.filter';
import { UseFilters } from '@nestjs/common';
import { UserNotFoundException } from './exception/UserNotFound.exception';
import { JwtAuthGuard } from './guards/JWT_AuthGuard.guard';
import { NoJWTFilter } from './filters/NoJWTFilter.filter';
import { UsersService } from '../users/users.service';

/*

    @SetMetadata('roles', [Role.Admin,Role.Soldier])
    @UseGuards(Role_Guard)
*/

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Get("validate")
    @UseGuards(JwtAuthGuard)
    @UseFilters(NoJWTFilter)
    async tokenValidator(@Res() res) {
        
        return res.json({ isValid: true});
        
    }

    
    @Post('user')
    @UseGuards(IsEmptyGuardLogin)
    @UseFilters(new EmptyExceptionFilter())
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

        
   

        // JWT token
        const resultJWTtoken = await this.authService.validateUserByPassword(loginUserDto);

        let user = await this.usersService.findOneByUsername(loginUserDto.username)
        if (resultJWTtoken) {

            let body = JSON.stringify({
                username: user.username,
                tokenInfo: resultJWTtoken,
                role: user.role

            })
            return body;

        } else {

           
            throw new NotFoundException(UserNotFoundException.NotFound);
            
        }
    }



    @Get("role_by_token")
    @UseGuards(JwtAuthGuard)
    async roleValidator(@Req() req){
        
        const usertoken = req.headers.authorization;
        let role = this.usersService.getRoleByJWT(usertoken)
        return role
    }
}