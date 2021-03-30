import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './iuser.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../RolesActivity/role.enum';
import { Major } from './common/major.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

	constructor(@InjectModel('User') private userModel: Model<IUser>) {}

	async create(createUserDto: CreateUserDto) {

		// check if the user already exists.
		const isExistingUser = await this.findOneByUsername(createUserDto.username);

		if (isExistingUser) {
			throw new HttpException("Username already exists", HttpStatus.BAD_REQUEST);
		}

		let createdUser = new this.userModel(createUserDto);
		return await createdUser.save();

	}

	async findOneByUsername(username: string): Promise<IUser> {

		const user = await this.userModel.findOne({"username": username});

		return user;
	}

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

	async findAllSoldiersInMajor(major: Major): Promise<string[]> {
		
		let users = await this.userModel.find();
		let soldiersInMajor = [];

		users.forEach(user => {

			let currMajor = user.major;
			let role = user.role;
			
			// A soldier who studies the requested major.
			if (role == Role.Soldier && currMajor !== undefined) {
				
				if (currMajor == major) {

					let fullString = user.username + " - " + user.firstName + " " + user.lastName;
					soldiersInMajor.push(fullString);

				}
			}
		});

		return soldiersInMajor;
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

	async deleteUser(username: string) {
		let user = await this.userModel.findOne({"username": username});

		if (user) {
			
			return await user.deleteOne();
		
		} else {

			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

		}
	}
}