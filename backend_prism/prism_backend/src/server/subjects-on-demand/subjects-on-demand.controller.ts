import { Controller, Param, Post } from '@nestjs/common';
import { FileHandlingService } from '../file-handling/file-handling.service';
import { Major } from '../users/common/major.enum';
import { UsersService } from '../users/users.service';
import { SubjectsOnDemandService } from './subjects-on-demand.service';

@Controller('subjects-on-demand')
export class SubjectsOnDemandController {


    constructor(private subjectsOnDemandService: SubjectsOnDemandService) { }


            
    @Post('/:major/:module/:subject/:soldierId')
    async getSoldierByMajorAndCommanderId(  @Param('major') major: Major,@Param('module') module : string,
                                            @Param('subject') subject:string,  @Param('soldierId') soldierId: string)
    {

        console.log("here ")
        console.log(major)
        console.log(module)
        console.log(subject)
        console.log(soldierId)
        
        console.log("-------------")

    }


}
