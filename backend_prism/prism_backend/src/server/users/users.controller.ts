import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Req, SetMetadata } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IsEmptyGuard } from './guards/isEmptyGuard.guard';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { SubjectsOnDemandService } from '../subjects-on-demand/subjects-on-demand.service';
import { Synchronizer } from '../synchronizer/Synchronizer';
import { Role } from '../RolesActivity/role.enum';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService,
        private subjectOnDemandService: SubjectsOnDemandService,
        private syncronizer: Synchronizer) { }


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

    @SetMetadata('roles', [Role.Admin, Role.Commander])
    @UseGuards(Role_Guard)
    @Post()
    @UseGuards(IsEmptyGuard)
    async create(@Body() createUserDto: CreateUserDto) {

        let result = await this.usersService.create(createUserDto, this.subjectOnDemandService);

        return result;
    }


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Get('soldiers')
    async getAllSoldiers() {

        return await this.usersService.findAllSoldiers();

    }

    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Get('all_users/:role')
    async getAllUsersByRole(@Param('role') role: Role) {

        return await this.usersService.getAllUsersByRole(role);
    }

    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Post('submissions/:major/:module')
    async getUsersSubmissions(@Body() soldiers, @Param('major') major: Major,
        @Param('module') module: string) {

        return await this.usersService.retrieveSubmissions(soldiers, major, module)

    }

    @Get(':id')
    async getSoldierById(@Param('id') personalId: string) {


        return await this.usersService.findOneByPersonalId(personalId)

    }


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Post('soldiers/majors')
    async getAllSoldiersInMajors(@Body() majors: Major[]) {

        return await this.usersService.findSoldiersInAllMajors(majors);
    }

    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Put(':username')
    async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {

        return await this.usersService.updateUserInfo(username, updateUserDto);

    }

    @SetMetadata('roles', [Role.Admin, Role.Commander])
    @UseGuards(Role_Guard)
    @Delete(':id')
    async deleteUser(@Param('id') personalId: string) {



        return await this.usersService.deleteUser(personalId, this.syncronizer);

    }


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
    @UseGuards(Role_Guard)
    @Get('my_soldiers/:major')
    async getSoldierByMajorAndCommanderId(@Param('major') major: Major, @Req() req) {

        const usertoken = req.headers.authorization;
        let commander = await this.usersService.getUserByJWT(usertoken);
        let commanderId = commander.personalId;

        return await this.usersService.getSoldiersByCommanderId(commanderId, major)

    }


}


