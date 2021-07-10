import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './iuser.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../RolesActivity/role.enum';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { jwtConstants } from '../RolesActivity/constants';
import { UserSubmissionService } from '../UserSubmission/user-submission.service';
import { IUserSubmission } from '../UserSubmission/iuser-submission.interface';
import { ReviewService } from '../review/review.service';
import { IReview } from '../review/ireview.interface';
import { SubjectsOnDemandService } from '../subjects-on-demand/subjects-on-demand.service';
import { Synchronizer } from '../synchronizer/Synchronizer';

@Injectable()
export class UsersService {

	userSubmissionHandler: UserSubmissionService;
	reviewHandler: ReviewService;
	syncronizer:Synchronizer

	constructor(@InjectModel('User') private userModel: Model<IUser>,
				@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>,
				@InjectModel('Reviews') private reviewsModel: Model<IReview>,
				userSubmissionService: UserSubmissionService) {
		
		this.userSubmissionHandler = new UserSubmissionService(userSubmissionModel);
		this.reviewHandler = new ReviewService(reviewsModel, userSubmissionModel, userSubmissionService);
	
		
	}


	async closeAllToNewSoldier(soldierId,majors:Major[],subjectOnDemandService: SubjectsOnDemandService){


		await subjectOnDemandService.closeAllSubjectToNewSoldier(majors, soldierId);

	}

	// add new user
	async create(createUserDto: CreateUserDto,subjectOnDemandService: SubjectsOnDemandService) {

		// check if the user already exists.
		const isExistingUser = await this.findOneByUsername(createUserDto.username);

		// check the user does not have personalID which exists.
		const isExistingUserById = await this.findOneByPersonalId(createUserDto.personalId);

		if (isExistingUser) {
			throw new HttpException("Username already exists", HttpStatus.BAD_REQUEST);
		}

		if (isExistingUserById) {
			throw new HttpException("Personal ID already exists", HttpStatus.BAD_REQUEST);
		}

		if (createUserDto.role === Role.Soldier) {
			await this.closeAllToNewSoldier(createUserDto.personalId, createUserDto.major, subjectOnDemandService)
		}

		let createdUser = new this.userModel(createUserDto);
		return await createdUser.save();

	}

	// get role of given token
	async getRoleByJWT(usertoken){

		let user = await this.getUserByJWT(usertoken);
		return user.role;

	}

	// Returns user object based on his token
	async getUserByJWT(usertoken){

		let jwt = require('jsonwebtoken')
		
		try {
		
		 
			const token = usertoken.split(' ');
			
			// decode JWT & retrieve username
			const decoded = jwt.verify(token[1], jwtConstants.secret);
	
			
			let personalId = decoded['personalId'];
			// obtain user by his username  & return it outside
			let user = await this.findOneByPersonalId(personalId)
			// return outside without password ( password is hashed )
			user.password = "";
			
			return user;
	
		}
		catch (e) {
;
			return undefined
		}




		
	}

	// get user by its personalId
	async findOneByPersonalId(personalId: string): Promise<IUser> {

		const user = await this.userModel.findOne({"personalId": personalId});
	
		
		return user;
	}

	// get user by its username
	async findOneByUsername(username: string): Promise<IUser> {

		const user = await this.userModel.findOne({"username": username});

		return user;
	}

	// get all soldiers 
	async findAllSoldiers(): Promise<string[]> {
		let listNames = [];

		let tempList = await this.userModel.find();

		tempList.forEach(user => {

			if (user.role == Role.Soldier) {

				let fullString = user.username + " - " + user.firstName + " " + user.lastName;
				listNames.push(fullString);

			}
		});


		return listNames;
	}

	// get all soldiers with same majors
	async findAllSoldiersInMajor(major: Major): Promise<string[]> {
		
		let users = await this.userModel.find();
		let soldiersInMajor = [];

		let soldierData;
		
		users.forEach(user => {

			let currMajor = user.major;
			let role = user.role;
			
			// A soldier who studies the requested major.
			if (role == Role.Soldier && currMajor !== undefined) {
				
				if (currMajor.includes(major)) {

					soldierData = {
						personalId : user.personalId,
						firstName : user.firstName,
						lastName: user.lastName
					}
					soldiersInMajor.push(soldierData)
				}
			}
		});

		return soldiersInMajor;
	}

	async findSoldiersInAllMajors(majors: Major[]) {
		let users = await this.userModel.find();
		let soldiersInMajors = [];
		let soldierData;

		users.forEach(user => {

			let currMajor = user.major;
			let role = user.role;
			
			// A soldier who studies the requested major.
			if (role == Role.Soldier && currMajor !== undefined) {
				
				// Soldier's major is a list with one element only.
				let currSoldierMajor = currMajor[0];
				if (majors.includes(currSoldierMajor)) {

					soldierData = {
						personalId : user.personalId,
						firstName : user.firstName,
						lastName: user.lastName,
						major: user.major
					};
					soldiersInMajors.push(soldierData);
				}
			}
		});

		return soldiersInMajors;
	}

	async updateUserInfo(username: string, updateUserDto: UpdateUserDto) {

		let newUserName = updateUserDto.username;

		// check if a user with the new username exists.
		if (newUserName !== undefined) {
			let isExistingUser = await this.findOneByUsername(newUserName);

			if (isExistingUser) {
				throw new HttpException("Username already exists", HttpStatus.BAD_REQUEST);
			}
		}

		let user = await this.findOneByUsername(username);

		if (user) {
			
			let updatedUser = this.updateInfoHelper(user, updateUserDto);

			let result = await updatedUser.save();
			return result;

		} else {

			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

		}
	}

	// Helper function for updateUserInfo - updates each field if was changed.
	private updateInfoHelper(user: IUser, updateUserDto: UpdateUserDto): IUser {

		if (updateUserDto.username !== undefined) {
			user.username = updateUserDto.username;
		}

		// check how to be done when the stored password is a hash.
		if (updateUserDto.password !== undefined) {
			user.password = updateUserDto.password;
		}

		if (updateUserDto.role !== undefined) {
			user.role = updateUserDto.role;
		}

		if (updateUserDto.firstName !== undefined) {
			user.firstName = updateUserDto.firstName;
		}

		if (updateUserDto.lastName !== undefined) {
			user.lastName = updateUserDto.lastName;
		}

		if (updateUserDto.phoneNumber !== undefined) {
			user.phoneNumber = updateUserDto.phoneNumber;
		}

		if (updateUserDto.commander !== undefined) {
			user.commander = updateUserDto.commander;
		}

		if (updateUserDto.major !== undefined) {
			user.major = updateUserDto.major;
		}

		if (updateUserDto.gender !== undefined) {
			user.gender = updateUserDto.gender;
		}

		return user;
	}

	// delete user by its username
	async deleteUser(personalId: string, syncronizer: Synchronizer) {
		let user = await this.userModel.findOne({"personalId": personalId});

		if (user) {
			
			//return await user.deleteOne();
			
			
			await user.deleteOne();
			return await syncronizer.syncUserDeletion(user.personalId)
			


		} else {

			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

		}
	}

	// retrieves first prop of json object
	getFirstProp(jsonObj) {
		let firstProp;
        for(var key in jsonObj) {
            if(jsonObj.hasOwnProperty(key)) {
                firstProp = jsonObj[key];
                break;
            }
        }
		return firstProp
	}

	async retrieveSubmissions(soldiersJson, major:Major, module:string){

        let soldiers = this.getFirstProp(soldiersJson)
		

		
		
		let allSubmissions = []

		let sendSubmission = {}
		for (let soldier of soldiers)
		{
			
			
			sendSubmission[soldier.personalId] = []
			let submissions = await this.userSubmissionHandler.getAllSoldierSubmissions(soldier.personalId,major,module)

			//let sendSubmission = {}
			for (let submission of submissions){
				
			
				let amoutSubmittedFiles_ = submission.submittedFiles.length
			
				let grade_ = undefined
				let gradeDescription_ = undefined
				// there is review => retrieve grade from review
				if (submission.isChecked){
					let id = submission.soldierId
					let major = submission.major
					let module = submission.module
					let subject = submission.subject
					let reviews = await this.reviewHandler.getAllReviewsPerAssignment(id, major, module, subject)
					
					for (let review of reviews){
						grade_ = review.grade
						gradeDescription_ = review.gradeDescription

						
					}
				}

				// compose neccessary data for displpaying in commander table
				sendSubmission[submission.soldierId].push( 
								
								{
									
									//firstName :soldier.firstName,  	
									checked:submission.isChecked,
									subject:submission.subject,
									grade:grade_,
									gradeDescription:gradeDescription_,
									
									amoutSubmittedFiles:amoutSubmittedFiles_
								}
				)
				
				//console.log(sendSubmission[submission.soldierId])
							
								
								
							

			}
			//allSubmissions.push(sendSubmission)
		}

		
		return sendSubmission
		//return allSubmissions
	}

	async getSoldiersByCommanderId(commanderId:string, majorSelected:Major){

		let commanderSoldiers = await this.userModel.find(
			{major:majorSelected,commander:commanderId, role:Role.Soldier}
		);

		return commanderSoldiers;
	}

	async getAllUsersByRole(role: Role) {

		let users = await this.userModel.find();
		let soldiersInRole = [];
		let userData;
		
		users.forEach(user => {

			let currRole = user.role;
			
			// A user with the required role.
			if (currRole === role) {
			
				userData = {
					personalId : user.personalId,
					firstName : user.firstName,
					lastName: user.lastName
				};

				soldiersInRole.push(userData);
			}
		});

		return soldiersInRole;
	}
}