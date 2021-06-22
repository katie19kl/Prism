import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FileHandlingService } from '../file-handling/file-handling.service';
import { Major } from '../users/common/major.enum';
import { UsersService } from '../users/users.service';
import { SubjectsOnDemandService } from './subjects-on-demand.service';

@Controller('subjects-on-demand')
export class SubjectsOnDemandController {


    constructor(private subjectsOnDemandService: SubjectsOnDemandService) { }


            
    @Post('open/:major/:module/:subject/:soldierId')
    async openSubjectToUser(  @Param('major') major: Major,@Param('module') module : string,
                                            @Param('subject') subject:string,  @Param('soldierId') soldierId: string)
    {


        return await this.subjectsOnDemandService.openNewSubjectToSoldier(major,module,subject,soldierId)

    }

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
        console.log("---------")
        console.log(major)
        console.log(module)
        console.log(soldiers)
        
        return await this.subjectsOnDemandService.getSoldiersClosedSubjects(major,module,soldiers)

    }


    @Get('user_opened/:major/:module/:personalId')
    async getSoldierOpenedSubjects(@Param('personalId') personalId: string,
        @Param('major') major: Major, @Param('module') module : string
    ){
        console.log(" HERERERERRERERE")
        return await this.subjectsOnDemandService.getSoldierOpenedSubjects(major,module,personalId)
    }

}
