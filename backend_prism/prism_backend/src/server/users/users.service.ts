import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './iuser.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

	constructor(@InjectModel('User') private userModel: Model<IUser>) {}

	async create(createUserDto: CreateUserDto) {

		let createdUser = new this.userModel(createUserDto);
		return await createdUser.save();

	}

	async findOneByUsername(username): Promise<IUser> {

		const user = await this.userModel.findOne({"username": username});

		return user;
	}
}