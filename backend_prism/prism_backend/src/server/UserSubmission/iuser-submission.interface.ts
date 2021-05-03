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
    
    
    // miutar
    grade: number;

    
}


/*
Review 

    

    studentId: string;
    major : Major
    module: string
    subject: string



    grade: number
    checker: commander/tester
    checkerId: string
    time: DataTime
    comment: string


    showTo: [commander v tester v soldier](list of roles).


*/



