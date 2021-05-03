
import { UserSubmissionDTO } from '../users/dto/user-submission.dto';
import {UserSubmissionService} from './user-submission.service'
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';

@Controller('user-submission')
export class UserSubmissionController {


    constructor(private usersService: UserSubmissionService) { }


    @Post()
    @UseInterceptors(FileInterceptor("file"))
    createUserSubmission(@UploadedFile() file: Express.Multer.File, @Body() userSubmissionDto: UserSubmissionDTO) {
        

        return this.usersService.addNewUserSubmission(userSubmissionDto, file);
    }



}
