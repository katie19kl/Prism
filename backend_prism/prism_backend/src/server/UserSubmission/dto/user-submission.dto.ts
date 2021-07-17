import { Major } from "../../users/common/major.enum";
import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";


export class UserSubmissionDTO {
    
    @IsNumberString()
    @IsNotEmpty()
    soldierId: string;

    @IsNotEmpty()
    major: Major

    @IsNotEmpty()
    module: string

    @IsNotEmpty()
    subject: string 

    @IsNotEmpty()
    isChecked: boolean;

    submittedFiles: string[];

    submittedTime: string;

    submittedDate: string;

    gradeDescription: string;
}
