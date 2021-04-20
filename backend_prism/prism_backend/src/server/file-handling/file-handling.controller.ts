import { Controller, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileHandlingService } from './file-handling.service';
import { Express } from 'express'
import { Get } from '@nestjs/common';
import { Major } from '../users/common/major.enum';


@Controller('file-handling')
export class FileHandlingController {
	constructor(private readonly fileHandlingService: FileHandlingService) {}


		// put admin permission only
		@Post("new_directory_major/:dirMajorName")
		async createNewMajorDir(@Param('dirMajorName') dirMajorName: String){
			console.log("----")
			return await this.fileHandlingService.createNewMajorDir(dirMajorName)
		}
	
		// put admin permission only
		@Get("delete_directory_major/:dirMajorName")
		async deleteMajorDir(@Param('dirMajorName') dirMajorName: Major){
			console.log("----")
			return await this.fileHandlingService.deleteMajorDir(dirMajorName)
		}
	
	
		@Get('majors')
		async getAllMajors(){
			let majors = FileHandlingService.getDirList(FileHandlingService.pathRootDirectory)
			return majors
		}


		@Get('modules/:major')
		async getAllModulesByMajor(@Param('major') major: Major) {
			let result = await this.fileHandlingService.getAllDirOfMajor(major);
			console.log(result);
	
			return result;
		}
		// MAJORS WORK!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

	@Post('modules/:major/:newModule')
	async addNewModuleToMajor(@Param('major') major: Major,@Param('newModule') newModule: string){
		
		console.log(major)
		console.log(newModule)

		this.fileHandlingService.createNewModuleDirInMajor(newModule,major)
		return "xxx"

	}

	@Get('subjects/:major/:module')
	async getAllSubjectInModule(@Param('major') major: Major, @Param('module') module: string) {
		let result = await this.fileHandlingService.getAllDirOfModule(major, module);

		console.log(result);
		console.log("!!___!!")
		return result;
	}


	@Get('remove_module/:major/:module_to_del')
	async removeModuleFromMajor(@Param('major') major: Major,@Param('module_to_del') module_to_del: string){
		
		console.log(major)
		console.log(module_to_del)

		this.fileHandlingService.removeModuleDirInMajor(module_to_del,major)
		return "xaxaxaxa"

	}

		// Modules WORK!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////






	@Post('upload_single_file/:major/:module/:subject')
	// (key for postman)
	@UseInterceptors(FileInterceptor('file',/*{dest: ".././FILE_ROOT"}*/))
	upload(@UploadedFile() file: Express.Multer.File,
			@Param('major') major: Major, @Param('module') module: string,
			@Param('subject') subject: string) {

		// service => it stores according to hierarchy 
		console.log("below----|----below")
		//console.log(file)
		let module_choosen = module
		let subject_choosen = subject
		let major_choosen = major

		this.fileHandlingService.storingFileToPath(file,FileHandlingService.pathRootDirectory+"/"+file.originalname	)
		//this.fileHandlingService.uploadFile(file,major_choosen, module_choosen, subject_choosen);
		return "xui single"



		//let major = res.Major
		//let module_num = res.module_num
		//let subjectIndexInsideModule = res.subject_index
	}


	@Get('files_in_subject/:major/:module/:subject')
	async getFiles(@Param('major') major: Major, @Param('module') module: string,
					@Param('subject') subject: string) {
		
			
		console.log("2-2-2-2-")
		console.log(subject)
		
		return await this.fileHandlingService.getAllFilesOfPath(major,module,subject);

		
	}
	

	@Get("files/:file_name/:major/:module/:subject")
	async getFileByName(@Param('file_name') file_name: String, @Res() res,
			@Param('major') major: Major, @Param('module') module: string,@Param('subject') subject: string) {
		
		// no need in return, because service 
		// inserts file to stream pipe
		let path =  this.fileHandlingService.createPathMajorModuleSubject(major,module,subject);
		console.log(path)
		console.log("-=-")
		await this.fileHandlingService.getFileByName(file_name, res, path);

    }












}
