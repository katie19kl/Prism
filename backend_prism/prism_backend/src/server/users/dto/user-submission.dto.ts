import { Major } from "../common/major.enum";

export class UserSubmissionDTO {
    
    studentId: string;

    major : Major
    module: string
    subject: string 

    isChecked: boolean;

    submittedFiles: string[];
    
    grade: number;

    submittedTimeStamp: Date;
}



