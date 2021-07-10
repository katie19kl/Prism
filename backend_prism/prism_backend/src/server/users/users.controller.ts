import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { IsEmptyGuard } from './guards/isEmptyGuard.guard';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { jwtConstants } from '../RolesActivity/constants';
import { SubjectsOnDemandService } from '../subjects-on-demand/subjects-on-demand.service';
import { Synchronizer } from '../synchronizer/Synchronizer';
import { Role } from '../RolesActivity/role.enum';



@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService, 
                private subjectOnDemandService: SubjectsOnDemandService,
                private syncronizer:Synchronizer) {}


                
    // only for checking, to be deleted.
    @Get("fooAdmin")
    @UseGuards(AdminRolesGuard)
    checkAdminPermission() {

        console.log("hererererererrererere-----")
        return {
            allowed: true
        }
    }



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

        let result = await this.usersService.create(createUserDto,this.subjectOnDemandService);
           
        return result;
    }

    // when the commander wants to see all the soldiers
    // (when wanting to edit someone's details for example).
    // ADMIN/COMMANDER.
    @Get('soldiers')
    async getAllSoldiers() {

        return await this.usersService.findAllSoldiers();

    }

    @Get('all_users/:role')
    async getAllUsersByRole(@Param('role') role: Role) {

        console.log("i am here kety!")
        return await this.usersService.getAllUsersByRole(role);
    }

    @Post('submissions/:major/:module')
    async getUsersSubmissions(@Body() soldiers, @Param('major') major: Major,
                              @Param('module') module: string) {
        
       return await this.usersService.retrieveSubmissions(soldiers,major,module)
        
    }

    @Get(':id')
    async getSoldierById(@Param('id') personalId: string){


        return await this.usersService.findOneByPersonalId(personalId)
        
    }

    @Post('soldiers/majors')
    async getAllSoldiersInMajors(@Body() majors: Major[]) {
    
        return await this.usersService.findSoldiersInAllMajors(majors);
    }

    // ADMIN/COMMANDER
    @Put(':username')
    async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {

        return await this.usersService.updateUserInfo(username, updateUserDto);

    }

    // ADMIN/COMMANDER
    @Delete(':id')
    async deleteUser(@Param('id') personalId: string) {

     
        
        return await this.usersService.deleteUser(personalId,this.syncronizer);

    }


	// 1 - Get user by commander Id & Major
    @Get('my_soldiers/:major')
    async getSoldierByMajorAndCommanderId(@Param('major') major: Major,@Req() req){

        const usertoken = req.headers.authorization;
        let commander = await this.usersService.getUserByJWT(usertoken);
        let commanderId = commander.personalId;
        
        return await this.usersService.getSoldiersByCommanderId(commanderId, major)
                
    }

	// 2 - Given array of users - arrUser --> returns corresponding array of all 
	//                                        their submision & reviews  

}

function FormDataRequest() {
    throw new Error('Function not implemented.');
}
