import { Controller, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileHandlingService } from './file-handling.service';
import { Express } from 'express'
import { Get } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { Delete } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { Put } from '@nestjs/common';


@Controller('file-handling')
export class FileHandlingController {

	constructor(private readonly fileHandlingService: FileHandlingService) {}


		// put admin permission only
		@Post("major/:dirMajorName")
		async createNewMajorDir(@Param('dirMajorName') dirMajorName: String){
			//console.log("----")
			return await this.fileHandlingService.createNewMajorDir(dirMajorName)
		}
	
		// put admin permission only
		@Delete("major/:dirMajorName")
		async deleteMajorDir(@Param('dirMajorName') dirMajorName: Major){
			//console.log("----")
			return await this.fileHandlingService.deleteMajorDir(dirMajorName)
		}
	
		@Get('majors')
		async getAllMajors(){
			let majors = FileHandlingService.getDirList(FileHandlingService.pathRootDirectory)
			return majors
		}


		@Get('major/modules/:major')
		async getAllModulesByMajor(@Param('major') major: Major) {
			let result = await this.fileHandlingService.getAllDirOfMajor(major);
			//console.log(result);
	
			return result;
		}


		// MAJORS WORK!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

	@Post('module/:major/:newModule')
	async addNewModuleToMajor(@Param('major') major: Major,@Param('newModule') newModule: string){
		

		return this.fileHandlingService.createNewModuleDirInMajor(newModule,major)
		 

	}

	
	@Put("module/rename/:major/:currentModuleName/:newModuleName")
	async renameModule(@Param('major') major: Major, 
						@Param('currentModuleName') currentModuleName:string,
						@Param('newModuleName') newModuleName:string)
	{
		//console.log("rename module")
		//console.log(major, currentModuleName, newModuleName)
		return this.fileHandlingService.renameModule(major, currentModuleName, newModuleName)
	}


	@Delete('module/:major/:module_to_del')
	async removeModuleFromMajor(@Param('major') major: Major,@Param('module_to_del') module_to_del: string){
		


		return this.fileHandlingService.removeModuleDirInMajor(module_to_del,major)

	}

		// Modules WORK!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////



	@Get('subjects/:major/:module')
	async getAllSubjectInModule(@Param('major') major: Major, @Param('module') module: string) {
		let result = await this.fileHandlingService.getAllDirOfModule(major, module);

		//console.log(result);
		//console.log("!!___!!")
		return result;
	}



	@Post("subject/:major/:module/:newNameSubject")
	async createNewSubject(@Param('major') major: Major,
						   @Param('module') module: string, @Param('newNameSubject') newNameSubject :string)
		{

			return  this.fileHandlingService.createNewSubject(major,module,newNameSubject)

		}



	@Delete("subject/:major/:module/:subjectToDelete")
	async deleteSubject(@Param('major') major: Major,
						   @Param('module') module: string, @Param('subjectToDelete') subjectToDelete :string)
	{
		//console.log("deleting subject!");
		return  this.fileHandlingService.removeSubject(major,module,subjectToDelete)

	}


	@Put("subject/rename/:major/:module/:subjectToRename/:newSubjectName")
	async renameSubject(@Param('major') major: Major, @Param('module') module: string,
						 @Param('subjectToRename') subjectToRename :string,
						 @Param('newSubjectName') newSubjectName :string)
	{

		return this.fileHandlingService.renameSubject(major, module, subjectToRename, newSubjectName);
	}


///////////////////////////////////////////////////////////////////////////////////////////

	@Get('files/:major/:module/:subject')
	async getFiles(@Param('major') major: Major, @Param('module') module: string,
					@Param('subject') subject: string) {
		
			
		//console.log("2-2-2-2-")
		//console.log(subject)
		
		return await this.fileHandlingService.getAllFilesOfPath(major,module,subject);

		
	}

	
	@Post('files/:major/:module/:subject')
	// (key for postman)
	@UseInterceptors(FileInterceptor("file"))
	upload(@UploadedFile() file: Express.Multer.File,
			@Param('major') major: Major, @Param('module') module: string,
			@Param('subject') subject: string) {

		let module_choosen = module
		let subject_choosen = subject
		let major_choosen = major

		return this.fileHandlingService.uploadFile(file,major_choosen, module_choosen, subject_choosen);
		 


	}

	@Get("files/:file_name/:major/:module/:subject")
	async getFileByName(@Param('file_name') file_name: String, @Res() res,
			@Param('major') major: Major, @Param('module') module: string,@Param('subject') subject: string) {
		
	
		return this.fileHandlingService.getFileByName(file_name, res, major, module, subject);

    }
	
////////////////////////////////////////////////////////////

	@Get("files/:file_name/:major/:module/:subject/:solutionDir")
	async getFileFromUserSolutionDir(@Param('file_name') file_name: String, @Res() res,
			@Param('major') major: Major, @Param('module') module: string,@Param('subject') subject: string,
			@Param('solutionDir') solutionDir: string) {
		

		return this.fileHandlingService.getFileByName(file_name, res, major, module, subject + "/" + solutionDir);

	}
/////////////////////////////////////////////////////
	@Delete("file/:major/:module/:subject/:file_name")
	async deleteFile(
			@Param('major') major: Major, @Param('module') module: string,
			@Param('subject') subject: string,@Param('file_name') file_name: string) 
	{
		return this.fileHandlingService.deleteFile(major,module,subject, file_name)
	}

}