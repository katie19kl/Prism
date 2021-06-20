import { Document } from 'mongoose'
import { Grade } from '../users/common/grade.enum';
import { Major } from '../users/common/major.enum';


export interface IUserSubmission extends Document {

    soldierId: string;
    major : Major
    module: string
    subject: string 
    submittedFiles: string[];
    submittedTime: string;
    submittedDate: string;

    // If review exist.
    isChecked: boolean;
    gradeDescription: String;//Grade;
}
