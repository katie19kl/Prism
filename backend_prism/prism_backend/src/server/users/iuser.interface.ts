import { Document } from 'mongoose'

export interface IUser extends Document {
    checkPassword(password: string): Promise<boolean>;
    email: string;
    password: string;
}