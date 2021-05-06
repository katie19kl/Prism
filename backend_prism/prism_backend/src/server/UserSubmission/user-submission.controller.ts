import { UserSubmissionDTO } from './dto/user-submission.dto';
import {UserSubmissionService} from './user-submission.service'
import { Controller, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from '../RolesActivity/constants';
import { Major } from '../users/common/major.enum';

@Controller('user-submission')
export class UserSubmissionController {


    constructor(private usersService: UserSubmissionService) { }


    @Post()
    @UseInterceptors(FileInterceptor("file"))
    createUserSubmission(@UploadedFile() file: Express.Multer.File,
                         @Body() userSubmissionDto: UserSubmissionDTO
                         ,@Req() req) {
        
        const usertoken = req.headers.authorization;
        return this.usersService.addNewUserSubmission(userSubmissionDto, file, usertoken);
    }

    @Get(':soldierId/:major/:module/:subject')
    getUserSubmissionByKey(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

            console.log("I am here!");

        return this.usersService.getUserSubmissionByKey(id, major, module, subject);

    }    


    @Delete("/:file_name")
    async removeSubmittedFile(@Param('file_name') file_name: String,@Body() userSubmissionDto: UserSubmissionDTO, @Req() req){
        
    
        console.log("=-=-=-=-=-=-=-")
        console.log(file_name)
        const usertoken = req.headers.authorization;


        let x =  this.usersService.removeSubmittedFile(userSubmissionDto,usertoken,file_name)
        console.log(x)
        return x
    }
    
    ///////// Allow delete single file from submission

}