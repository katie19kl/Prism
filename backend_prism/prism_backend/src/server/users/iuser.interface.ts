import { Document } from 'mongoose'
import { Role } from '../authorization/role.enum';

export interface IUser extends Document {
    checkPassword(password: string): Promise<boolean>;
    username: string;
    password: string;
    role: Role;
}