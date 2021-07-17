import { Major } from "../../users/common/major.enum";


export class UserSubmissionDTO {
    
    soldierId: string;

    major: Major

    module: string

    subject: string 

    isChecked: boolean;

    submittedFiles: string[];

    submittedTime: string;

    submittedDate: string;

    gradeDescription: string;
}
