import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsOptional,
         MaxLength, MinLength, IsNumberString } from "class-validator";
import { Role } from "src/server/RolesActivity/role.enum";
import { Gender } from "../common/gender.enum";
import { Major } from "../common/major.enum";
import { IsGender } from "../decorators/gender-validation.decorator";
import { IsMajor } from "../decorators/major-validation.decorator";
import { IsPhoneNumber } from "../decorators/phoneNumber-validation.decorator";
import { IsRole } from "../decorators/role-validation.decorator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsNumberString()
    personalId: string;


    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;


    @MinLength(6, {
        message: "Password is too short",
    })
    @MaxLength(20, {
        message: "Password is too long",
    })
    password: string;

    
    @IsNotEmpty()
    @IsRole({
        message: "The given role does not exist"
    })
    role: Role;


    @IsAlpha()
    @IsNotEmpty()
    firstName: string;


    @IsAlpha()
    @IsNotEmpty()
    lastName: string;


    @IsOptional()
    @IsPhoneNumber({
        message: "You did not enter an appropriate phone number"
    })
    @IsNumberString()
    phoneNumber: string;


    @IsNotEmpty()
    @IsGender({
        message: "The given gender does not exist"
    })
    gender: Gender;


    @IsOptional()
    @IsNumberString()
    commander: string;


    @IsOptional()
    @IsMajor({
        message: "The given major does not exist"
    })
    major: Major[];
}