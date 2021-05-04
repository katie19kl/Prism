import { Major } from "../../users/common/major.enum";

export class CreateReviewDto {
    
    studentId: string;

    major : Major
    module: string
    subject: string 

    isChecked: boolean;

    submittedFiles: string[];
    
    grade: number;

    submittedTimeStamp: Date;
}
