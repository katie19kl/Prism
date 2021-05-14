import { Document } from 'mongoose'
import { Major } from '../users/common/major.enum';


export interface IUserSubmission extends Document {


    soldierId: string;

    major : Major
    module: string
    subject: string 

    submittedFiles: string[];

    submittedTime: string;
    
    submittedDate: string;


   
    // If reaview exist
    isChecked: boolean;
    
    // not necessary.
    grade: number;

    
}
