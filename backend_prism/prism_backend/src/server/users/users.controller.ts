import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { IsEmptyGuard } from './guards/isEmptyGuard.guard';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { jwtConstants } from '../RolesActivity/constants';


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }





    @Get("role_by_JWT")
    @UseGuards(JwtAuthGuard)
    async extractUserRole(@Req() req) {
        const usertoken = req.headers.authorization;
        return { role: await this.usersService.getRoleByJWT(usertoken) }
    }



    @Get('info_by_JWT')
    @UseGuards(JwtAuthGuard)
    async extractUserInfo(@Req() req) {

        const usertoken = req.headers.authorization;
        return await this.usersService.getUserByJWT(usertoken);

    }

    @Post()
    @UseGuards(IsEmptyGuard)
    // ADMIN/COMMANDER
    async create(@Body() createUserDto: CreateUserDto) {
        console.log("add new user/admin ");

        console.log(createUserDto);

        let result = await this.usersService.create(createUserDto);
        console.log(result);
        return result;
    }


    // when the commander wants to see all the soldiers
    // (when wanting to edit someone's details for example).
    // ADMIN/COMMANDER.
    @Get('soldiers')
    async getAllSoldiers() {

        console.log("returning list of soldier usernames(to be changed to full names)");
        return await this.usersService.findAllSoldiers();

    }

    @Post('submissions/:major/:module')
    async getUsersSubmissions(@Body() soldiers,@Param('major') major: Major,
                              @Param('module') module: string){
        
       return await this.usersService.retrieveSubmissions(soldiers,major,module)
        
    }




    @Get(':id')
    async getSoldierById(@Param('id') personalId: string){


        return await this.usersService.findOneByPersonalId(personalId)
        
    }

    /*// ADMIN/COMMANDERS.
    @Get('soldiers/:major')
    async getSoldiersByMajor(@Param('major') major: Major) {

        console.log("returning list of all soldiers in the major: " + major);
        return await this.usersService.findAllSoldiersInMajor(major);

    }*/

    @Post('soldiers/majors')
    async getAllSoldiersInMajors(@Body() majors: Major[]) {
        console.log(majors);
        
        return await this.usersService.findSoldiersInAllMajors(majors);
    }



    // ADMIN/COMMANDER
    @Put(':username')
    async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {

        console.log("updating user info");
        console.log(updateUserDto);

        return await this.usersService.updateUserInfo(username, updateUserDto);

    }


    // ADMIN/COMMANDER
    @Delete(':id')
    async deleteUser(@Param('id') personalId: string) {

        console.log('deleting user with the username: ' + personalId);
        return await this.usersService.deleteUser(personalId);

    }


    // only for checking, to be deleted.
    @Get("fooAdmin")
    @UseGuards(AdminRolesGuard)
    checkAdminPermission() {
        return {
            allowed: true
        }
    }


	// 1 - Get user by commander Id & Major
    @Get('my_soldiers/:major')
    async getSoldierByMajorAndCommanderId(@Param('major') major: Major,@Req() req){



        const usertoken = req.headers.authorization;
        let commander = await this.usersService.getUserByJWT(usertoken);
        let commanderId = commander.personalId;
        //console.log(commanderId)

        
        return await this.usersService.getSoldiersByCommanderId(commanderId, major)
        
        //return await this.usersService.findOneByPersonalId(personalId)
        
    }







	// 2 - Given array of users - arrUser --> returns corresponding array of all 
	//                                        their submision & reviews  









}

function FormDataRequest() {
    throw new Error('Function not implemented.');
}
