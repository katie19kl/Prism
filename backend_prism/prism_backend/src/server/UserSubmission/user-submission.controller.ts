import { UserSubmissionDTO } from './dto/user-submission.dto';
import { UserSubmissionService } from './user-submission.service'
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';
import { Role } from '../RolesActivity/role.enum';
import { 
    Controller,
    Get, 
    Param, 
    Post, 
    Req, 
    SetMetadata, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';



@UseGuards(JwtAuthGuard)
@Controller('user-submission')
export class UserSubmissionController {

    constructor(private userSubmisssionService: UserSubmissionService) { }

 
	@SetMetadata('roles', [Role.Soldier])
	@UseGuards(Role_Guard)
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    createUserSubmission(@UploadedFile() file: Express.Multer.File,
                         @Body() userSubmissionDto: UserSubmissionDTO
                         ,@Req() req) {
        
        const usertoken = req.headers.authorization;
        return this.userSubmisssionService.addNewUserSubmission(userSubmissionDto, file, usertoken);
    }

    
    @Get(':soldierId/:major/:module/:subject')
    async getUserSubmissionByKey(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        try {
            let submissionInfo = await this.userSubmisssionService.getUserSubmissionByKey(
                id, major, module, subject);

            return submissionInfo;
    
        }
        catch (error) {
            
            throw error;
        }
    }


    @Get(':soldierId')
    async getUserSubmission(@Param('soldierId') id: string) {
        try {
            let submissionInfo = await this.userSubmisssionService.getUserSubmission(id);
            return submissionInfo;
        }
        catch (error) {
            
            throw error;
        }
    } 


    @SetMetadata('roles', [Role.Soldier])
	@UseGuards(Role_Guard)
    @Delete("/:file_name")
    async removeSubmittedFile(@Param('file_name') file_name: String, 
                              @Body() userSubmissionDto: UserSubmissionDTO,
                              @Req() req) {
        
        const usertoken = req.headers.authorization;

        let x =  await this.userSubmisssionService.removeSubmittedFile(userSubmissionDto, usertoken, file_name);
        return x;
    }


    @SetMetadata('roles', [Role.Admin,Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
    @Get('/:major')
    async getAllSubmissionsByMajor(@Param('major') major: Major) {

        try {
            let submissionInfo = await this.userSubmisssionService.getAllSubmissionsByMajor(major);
            return submissionInfo;
    
        }
        catch (error) {
            
            throw error;
        }
    }    
}