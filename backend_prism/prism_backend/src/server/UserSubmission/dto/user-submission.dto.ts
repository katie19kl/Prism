import { Grade } from "src/server/users/common/grade.enum";
import { Major } from "../../users/common/major.enum";

export class UserSubmissionDTO {
    
    soldierId: string;

    major : Major
    module: string
    subject: string 

    isChecked: boolean;

    submittedFiles: string[];
    
    grade: number;

    submittedTime: string;

    submittedDate: string;

    gradeDescription: string;


}




