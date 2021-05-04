
import { UserSubmissionDTO } from '../users/dto/user-submission.dto';
import {UserSubmissionService} from './user-submission.service'
import { Controller, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from '../RolesActivity/constants';

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


    @Delete("/:file_name")
    
    removeSubmittedFile(@Param('file_name') file_name: String,@Body() userSubmissionDto: UserSubmissionDTO, @Req() req){
        
        
        console.log("=-=-=-=-=-=-=-")
        console.log(file_name)
        const usertoken = req.headers.authorization;



        return this.usersService.removeSubmittedFile(userSubmissionDto,usertoken,file_name)
    }

    ///////// Allow delete single file from submission

}
