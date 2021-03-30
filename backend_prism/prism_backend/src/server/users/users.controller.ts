import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { IsEmptyGuard } from './guards/isEmptyGuard.guard';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post()
    @UseGuards(IsEmptyGuard)
    // ADMIN/COMMANDER
    async create(@Body() createUserDto: CreateUserDto) {
        console.log("add new user/admin ");
        return await this.usersService.create(createUserDto);
    }


    // when the commander wants to see all the soldiers
    // (when wanting to edit someone's details for example).
    // ADMIN/COMMANDER.
    @Get('soldiers')
    async getAllSoldiers() {

        console.log("returning list of soldier usernames(to be changed to full names)");
        return await this.usersService.findAllSoldiers();

    }

    // ADMIN/COMMANDERS.
    @Get('soldiers/:major')
    async getSoldiersByMajor(@Param('major') major: Major) {

        console.log("returning list of all soldiers in the major: " + major);
        return await this.usersService.findAllSoldiersInMajor(major);
        
    }

    // ADMIN/COMMANDER
    @Put(':username')
    async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {

        console.log("updating user info");
        console.log(updateUserDto);

        return await this.usersService.updateUserInfo(username, updateUserDto);

    }


    // ADMIN/COMMANDER
    @Delete(':username')
    async deleteUser(@Param('username') username: string) {

        console.log('deleting user with the username: ' + username);
        return await this.usersService.deleteUser(username);

    }


    // only for checking, to be deleted.
    @Get("fooAdmin")
    @UseGuards(AdminRolesGuard)
    checkAdminPermission() {
        return {
            allowed: true
        }
    }

}