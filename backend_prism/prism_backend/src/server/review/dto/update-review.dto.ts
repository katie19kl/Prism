import { PartialType } from "@nestjs/mapped-types";
import { IsAlpha, IsDate, IsNotEmpty, IsNumberString, IsOptional } from "class-validator";
import { Role } from "src/server/RolesActivity/role.enum";
import { IsMajor } from "src/server/users/decorators/major-validation.decorator";
import { IsRole } from "src/server/users/decorators/role-validation.decorator";
import { Major } from "../../users/common/major.enum";
import { CreateReviewDto } from "./create-review.dto";


export class updateReviewDto extends PartialType(CreateReviewDto) {
    

    @IsNotEmpty()
    @IsNumberString()
    soldierId: string;

    @IsNotEmpty()
    @IsMajor()
    major : Major

    @IsNotEmpty()
    module: string

    @IsNotEmpty()
    subject: string 

    // grading. Might change to an enum {checked-is good, checked-to be fixed}.
    // one of the variables that could be updated.
    @IsOptional()
    grade: string;

    // time of the review submitting.
    @IsNotEmpty()
    //@IsDate()
    submittedTimeStamp: Date;

    // commander/tester.
    @IsOptional()
    @IsRole({
        message: "The given role does not exist"
    })
    checkerRole: Role;

    @IsNotEmpty()
    @IsNumberString()
    checkerId: string;

    // the review itself - one of the variables that could be updated.
    @IsOptional()
    comment: string;

    // define who can see the review - one of the variables that could be updated.
    @IsOptional()
    showTo: Role[];
}
