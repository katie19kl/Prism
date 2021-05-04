import { Document } from 'mongoose'
import { Major } from '../users/common/major.enum';


export interface IUserSubmission extends Document {


    studentId: string;

    major : Major
    module: string
    subject: string 

    submittedFiles: string[];

    submittedTimeStamp: Date;
   
    // If reaview exist
    isChecked: boolean;
    
    // not necessary.
    grade: number;

    
}
