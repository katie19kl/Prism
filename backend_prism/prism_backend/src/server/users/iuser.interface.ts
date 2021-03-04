import { Document } from 'mongoose'

export interface IUser extends Document {
    checkPassword(password: string): Promise<boolean>;
    username: string;
    password: string;
}