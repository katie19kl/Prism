import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './iuser.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../RolesActivity/role.enum';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { jwtConstants } from '../RolesActivity/constants';

@Injectable()
export class UsersService {

	constructor(@InjectModel('User') private userModel: Model<IUser>) {}
	
	// add new user
	async create(createUserDto: CreateUserDto) {

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
	
		const token = usertoken.split(' ');
		
		// decode JWT & retrieve username
		const decoded = jwt.verify(token[1], jwtConstants.secret);
		console.log(decoded);
		let personalId = decoded['personalId'];
		console.log(personalId)

		// obtain user by his username  & return it outside
		let user = await this.findOneByPersonalId(personalId)
		// return outside without password ( password is hashed )
		user.password = "";
		console.log(user);


		return user;
	}

	// get user by its personalId
	async findOneByPersonalId(personalId: string): Promise<IUser> {

		const user = await this.userModel.findOne({"personalId": personalId});
		console.log(user)
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

		console.log(majors);
		
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
						lastName: user.lastName
					};
					soldiersInMajors.push(soldierData);
				}
			}
		});

		return soldiersInMajors;
	}

	async updateUserInfo(username: string, updateUserDto: UpdateUserDto) {

		let user = await this.findOneByUsername(username);

		if (user) {

			let updatedUser = await this.updateInfoHelper(user, updateUserDto);

			return await updatedUser.save();

		} else {

			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

		}
	}

	// Helper function for updateUserInfo - updates each field if was changed.
	private async updateInfoHelper(user: IUser, updateUserDto: UpdateUserDto): Promise<IUser> {

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
	async deleteUser(personalId: string) {
		let user = await this.userModel.findOne({"personalId": personalId});

		if (user) {
			
			return await user.deleteOne();
		
		} else {

			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

		}
	}
}