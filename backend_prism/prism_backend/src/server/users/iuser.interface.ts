import { Document } from 'mongoose'
import { Role } from '../RolesActivity/role.enum';
import { Gender } from './common/gender.enum';
import { Major } from './common/major.enum';


export interface IUser extends Document {
    checkPassword(password: string): Promise<boolean>;
    personalId: string;
    username: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
    commander: string;
    major: Major;
    personalId: string;
}