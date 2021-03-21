import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../RolesActivity/role.enum';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';


@Controller('users')
//@UseGuards(RolesGuard)

export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post() 
    async create(@Body() createUserDto: CreateUserDto) {
        console.log("add new user/admin ")
        return await this.usersService.create(createUserDto);
    }

    // This route will require successfully passing our default auth strategy (JWT) in order
    // to access the route
    @Get('test')
    @UseGuards(AuthGuard())
    testAuthRoute() {
        return {
            message: 'You did it!'
        }
    }


    @Get("fooAdmin")
   //@UseGuards(AdminRolesGuard)
    checkAdminPermission(): string {
        return "admin"
    }



}