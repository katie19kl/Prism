import { Controller, Param, Post, Req, Res, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor} from '@nestjs/platform-express';
import { FileHandlingService } from './file-handling.service';
import { Express } from 'express'
import { Get } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { Delete } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SubjectsOnDemandService } from '../subjects-on-demand/subjects-on-demand.service';
import { Synchronizer } from '../synchronizer/Synchronizer';
import { Role } from '../RolesActivity/role.enum';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';


@UseGuards(JwtAuthGuard)
@Controller('file-handling')
export class FileHandlingController {

	constructor(
		private readonly fileHandlingService: FileHandlingService,
		private subjectOnDemandService: SubjectsOnDemandService, 
		private userService: UsersService,
		private synchronizer: Synchronizer) {}


	@SetMetadata('roles', [Role.Admin])
	@UseGuards(Role_Guard)
	@Post("major/:dirMajorName")
	async createNewMajorDir(@Param('dirMajorName') dirMajorName: String) {

		return await this.fileHandlingService.createNewMajorDir(dirMajorName);
	}


	@SetMetadata('roles', [Role.Admin])
	@UseGuards(Role_Guard)
	@Delete("major/:dirMajorName")
	async deleteMajorDir(@Param('dirMajorName') dirMajorName: Major) {

		return await this.fileHandlingService.deleteMajorDir(dirMajorName);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
	@Get('majors')
	async getAllMajors() {

		let majors = FileHandlingService.getDirList(FileHandlingService.pathRootDirectory);
		return majors;
	}

	@Get('major/modules/:major')
	async getAllModulesByMajor(@Param('major') major: Major) {
		let result = await this.fileHandlingService.getAllDirOfMajor(major);

		return result;
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Post('module/:major/:newModule')
	async addNewModuleToMajor(@Param('major') major: Major, @Param('newModule') newModule: string) {

		return this.fileHandlingService.createNewModuleDirInMajor(newModule, major);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Put("module/rename/:major/:currentModuleName/:newModuleName")
	async renameModule(@Param('major') major: Major,
		@Param('currentModuleName') currentModuleName: string,
		@Param('newModuleName') newModuleName: string) {

		return this.fileHandlingService.renameModule(major, currentModuleName, newModuleName, this.synchronizer);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Delete('module/:major/:module_to_del')
	async removeModuleFromMajor(@Param('major') major: Major, @Param('module_to_del') module_to_del: string) {

		return this.fileHandlingService.removeModuleDirInMajor(module_to_del, major, this.synchronizer);
	}

	
	@Get('subjects/:major/:module')
	async getAllSubjectInModule(@Param('major') major: Major, @Param('module') module: string) {

		let result = await this.fileHandlingService.getAllDirOfModule(major, module);
		return result;
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Post("subject/:major/:module/:newNameSubject")
	async createNewSubject(@Param('major') major: Major,
		@Param('module') module: string, @Param('newNameSubject') newNameSubject: string) {

		return this.fileHandlingService.createNewSubject(
			major, module, newNameSubject, this.userService,
			this.subjectOnDemandService);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Delete("subject/:major/:module/:subjectToDelete")
	async deleteSubject(@Param('major') major: Major,
		@Param('module') module: string, @Param('subjectToDelete') subjectToDelete: string) {

		return this.fileHandlingService.removeSubject(major, module, subjectToDelete, this.synchronizer);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander])
	@UseGuards(Role_Guard)
	@Put("subject/rename/:major/:module/:subjectToRename/:newSubjectName")
	async renameSubject(@Param('major') major: Major, @Param('module') module: string,
		@Param('subjectToRename') subjectToRename: string,
		@Param('newSubjectName') newSubjectName: string) {

		return this.fileHandlingService.renameSubject(major, module, subjectToRename, newSubjectName, this.synchronizer);
	}


	@Get('files/:major/:module/:subject')
	async getFiles(@Param('major') major: Major, @Param('module') module: string,
		@Param('subject') subject: string) {

		return await this.fileHandlingService.getAllFilesOfPath(major, module, subject);
	}


	@Post('files/:major/:module/:subject')
	@SetMetadata('roles', [Role.Admin, Role.Commander, Role.Soldier])
	@UseGuards(Role_Guard)
	@UseInterceptors(FileInterceptor("file"))
	upload(@UploadedFile() file: Express.Multer.File,
		@Param('major') major: Major, @Param('module') module: string,
		@Param('subject') subject: string) {

		let module_choosen = module;
		let subject_choosen = subject;
		let major_choosen = major;

		return this.fileHandlingService.uploadFile(file, major_choosen, module_choosen, subject_choosen);
	}


	@Get("files/:file_name/:major/:module/:subject")
	async getFileByName(@Param('file_name') file_name: String, @Res() res,
		@Param('major') major: Major, @Param('module') module: string, @Param('subject') subject: string) {

		return this.fileHandlingService.getFileByName(file_name, res, major, module, subject);
	}


	@Get("files/:file_name/:major/:module/:subject/:solutionDir")
	async getFileFromUserSolutionDir(@Param('file_name') file_name: String, @Res() res,
		@Param('major') major: Major, @Param('module') module: string, @Param('subject') subject: string,
		@Param('solutionDir') solutionDir: string) {

		return this.fileHandlingService.getFileByName(file_name, res, major, module, subject + "/" + solutionDir);
	}


	@SetMetadata('roles', [Role.Admin, Role.Commander, Role.Soldier])
	@UseGuards(Role_Guard)
	@Delete("file/:major/:module/:subject/:file_name")
	async deleteFile(
		@Param('major') major: Major, @Param('module') module: string,
		@Param('subject') subject: string, @Param('file_name') file_name: string) {

		return this.fileHandlingService.deleteFile(major, module, subject, file_name);
	}
}