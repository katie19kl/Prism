import { UserSubmissionDTO } from '../users/dto/user-submission.dto';
import {UserSubmissionService} from './user-submission.service'
import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Major } from '../users/common/major.enum';


@Controller('user-submission')
export class UserSubmissionController {


    constructor(private usersService: UserSubmissionService) { }

    @Post('bla')
    bla() {
        console.log("hi")
    }

    /*@Post()
    @UseInterceptors(FileInterceptor("file"))
    createUserSubmission(@UploadedFile() file: Express.Multer.File, 
                        @Body() userSubmissionDto: UserSubmissionDTO) {
        
        console.log("I am here");
        return this.usersService.addNewUserSubmission(userSubmissionDto, file);
    }*/

    @Post()
    //@UseInterceptors(FileInterceptor("file"))
    createUserSubmission(@Body() userSubmissionDto: UserSubmissionDTO) {
        
        console.log("I am here");
        //return this.usersService.addNewUserSubmission(userSubmissionDto, file);
    }

	@Get(':soldierId/:major/:module/:subject')
    getUserSubmissionByKey(@Param('soldierId') id: string, @Param('major') major: Major,
        @Param('module') module: string, @Param('subject') subject: string) {

            console.log('bla')
        
        return this.usersService.getUserSubmissionByKey(id, major, module, subject);
    }

}
