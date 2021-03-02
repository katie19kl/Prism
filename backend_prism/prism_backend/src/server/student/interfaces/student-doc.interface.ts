import { Document } from 'mongoose';

export interface StudentDoc extends Document {
    readonly name: string;
    readonly age: number;
    readonly personalId: string;
}