import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";
import { Role } from "src/server/RolesActivity/role.enum";
import { Grade } from "src/server/users/common/grade.enum";
import { IsRole } from "src/server/users/decorators/role-validation.decorator";
import { IsSingleMajor } from "src/server/users/decorators/single-major-validation.decorator";
import { Major } from "../../users/common/major.enum";


export class CreateReviewDto {
    
    @IsNotEmpty()
    @IsNumberString()
    soldierId: string;

    @IsNotEmpty()
    @IsSingleMajor()
    major : Major
    
    @IsNotEmpty()
    module: string
    
    @IsNotEmpty()
    subject: string 

    // grading
    @IsOptional()
    @IsNumberString()
    grade: number;

    @IsNotEmpty()
    gradeDescription: Grade;

    // time of the review submitting.
    @IsOptional()
    submittedDate: string;

    @IsOptional()
    submittedTime: string;

    // commander/tester.
    @IsNotEmpty()
    @IsRole({
        message: "The given role does not exist"
    })
    checkerRole: Role;

    @IsNotEmpty()
    @IsNumberString()
    checkerId: string;

    // the review itself.
    @IsNotEmpty()
    comment: string;

    // define who can see the review
    @IsNotEmpty()
    showTo: Role[];
}
