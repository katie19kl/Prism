import { PartialType } from "@nestjs/mapped-types";
import {IsNotEmpty, IsNumberString, IsOptional } from "class-validator";
import { Role } from "src/server/RolesActivity/role.enum";
import { Grade } from "src/server/users/common/grade.enum";
import { IsRole } from "src/server/users/decorators/role-validation.decorator";
import { IsSingleMajor } from "src/server/users/decorators/single-major-validation.decorator";
import { Major } from "../../users/common/major.enum";
import { CreateReviewDto } from "./create-review.dto";


export class updateReviewDto extends PartialType(CreateReviewDto) {
    
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

    // grading.
    @IsOptional()
    @IsNumberString()
    grade: number;

    @IsOptional()
    gradeDescription: Grade;

    // time of the review submitting.
    @IsNotEmpty()
    submittedDate: string;

    @IsNotEmpty()
    submittedTime: string;

    // commander/tester.
    @IsOptional()
    @IsRole({
        message: "The given role does not exist"
    })
    checkerRole: Role;

    @IsNotEmpty()
    @IsNumberString()
    checkerId: string;

    // the review itself
    @IsOptional()
    comment: string;

    // define who can see the review
    @IsOptional()
    showTo: Role[];
}
