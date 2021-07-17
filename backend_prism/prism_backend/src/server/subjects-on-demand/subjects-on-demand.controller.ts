import { Body, Controller, Get, Param, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../RolesActivity/role.enum';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';
import { Major } from '../users/common/major.enum';

import { SubjectsOnDemandService } from './subjects-on-demand.service';

@UseGuards(JwtAuthGuard)
@Controller('subjects-on-demand')
export class SubjectsOnDemandController {


    constructor(private subjectsOnDemandService: SubjectsOnDemandService) { }

    @SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)    
    @Post('open/:major/:module/:subject/:soldierId')
    async openSubjectToUser(@Param('major') major: Major,@Param('module') module : string,
                                            @Param('subject') subject:string,  @Param('soldierId') soldierId: string)
    {


        return await this.subjectsOnDemandService.openNewSubjectToSoldier(major,module,subject,soldierId)

    }

    @SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)  
    @Post('close/:major/:module/:subject/:soldierId')
    async closeSubjectToUser(  @Param('major') major: Major,@Param('module') module : string,
                                            @Param('subject') subject:string,  @Param('soldierId') soldierId: string)
    {

        
        return await this.subjectsOnDemandService.closeSubjectToSoldier(major,module,subject,soldierId)

    }



    @Post('user_closed/:major/:module')
    async getSoldierClosedSubjects( @Body() soldiers,  
        @Param('major') major: Major, @Param('module') module : string)
    {    
        return await this.subjectsOnDemandService.getSoldiersClosedSubjects(major,module,soldiers)
    }


    @Get('user_opened/:major/:module/:personalId')
    async getSoldierOpenedSubjects(@Param('personalId') personalId: string,
        @Param('major') major: Major, @Param('module') module : string
    ){
        console.log(" HERERERERRERERE")
        return await this.subjectsOnDemandService.getSoldierOpenedSubjects(major,module,personalId)
    }


    @Get("my_on_demands/:personalId")
    async getSoldierOpened(@Param('personalId') personalId: string){
        console.log("XXX")
        return await this.subjectsOnDemandService.getSoldierOpened(personalId)
    }

}
