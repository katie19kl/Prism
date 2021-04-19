import { Controller, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileHandlingService } from './file-handling.service';
import { Express } from 'express'
import { Get } from '@nestjs/common';
import { Major } from '../users/common/major.enum';


@Controller('file-handling')
export class FileHandlingController {
	constructor(private readonly fileHandlingService: FileHandlingService) {}


	@Post('single_file')
	// (key for postman)
	@UseInterceptors(FileInterceptor('file',/*{dest: ".././FILE_ROOT"}*/))
	upload(@UploadedFile() file: Express.Multer.File) {

		// service => it stores according to hierarchy 
		console.log("below----|----below")
		//console.log(file)
		let module_num = "2"
		let subject_num = "1"
		this.fileHandlingService.uploadFile(file,Major.Network, module_num, subject_num);
		return "xui single"



		//let major = res.Major
		//let module_num = res.module_num
		//let subjectIndexInsideModule = res.subject_index
	}


	@Get('all_files')
	async getFiles(){
		return this.fileHandlingService.getAllFilesOfPath(FileHandlingService.pathRootDirectory);
	}


	@Get("files/:file_name")
	async getFileByName(@Param('file_name') file_name: String, @Res() res) {
		
		// no need in return, because service 
		// inserts file to stream pipe
		this.fileHandlingService.getFileByName(file_name, res);

    }

	// put admin permission only
	@Post("new_directory_major/:dirMajorName")
	async createNewMajorDir(@Param('dirMajorName') dirMajorName: String){
		console.log("----")
		return await this.fileHandlingService.createNewMajorDir(dirMajorName)
	}

	// put admin permission only
	@Get("delete_directory_major/:dirMajorName")
	async deleteMajorDir(@Param('dirMajorName') dirMajorName: String){
		console.log("----")
		return await this.fileHandlingService.deleteMajorDir(dirMajorName)
	}

	@Get('modules/:major')
	async getAllModulesByMajor(@Param('major') major: Major) {
		let result = await this.fileHandlingService.getAllDirOfMajor(major);
		console.log(result);

		return result;
	}

	@Get('subjects/:major/:module')
	async getAllSubjectInModule(@Param('major') major: Major, @Param('module') module: string) {
		let result = await this.fileHandlingService.getAllDirOfModule(major, module);

		console.log(result);

		return result;
	}

	@Get('files_in_subject/:major/:module/:subject')
	async getAllFilesInSubject(@Param('major') major: Major, @Param('module') module: string,
		@Param('subject') subject: string) {
		
		let result = await this.fileHandlingService.getAllContentOfSubject(major, module, subject);

		console.log(result);

		return result;
	}
}
