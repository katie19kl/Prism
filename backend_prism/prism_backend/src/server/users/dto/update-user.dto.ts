import { Role } from "src/server/RolesActivity/role.enum";
import { Gender } from "../common/gender.enum";
import { Major } from "../common/major.enum";
import { CreateUserDto } from "./create-user.dto";
import { PartialType } from '@nestjs/mapped-types';
import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { IsRole } from "../decorators/role-validation.decorator";
import { IsGender } from "../decorators/gender-validation.decorator";
import { IsMajor } from "../decorators/major-validation.decorator";


export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsAlphanumeric()
    @IsOptional()
    readonly username: string;
    

    @MinLength(6, {
        message: "Password is too short",
    })
    @MaxLength(20, {
        message: "Password is too long",
    })
    @IsOptional()
    readonly password: string;
    

    @IsNotEmpty()
    @IsOptional()
    @IsRole({
        message: "The given role does not exist"
    })
    readonly role: Role;
    
    
    @IsAlpha()
    @IsOptional()
    readonly firstName: string;
    
    
    @IsAlpha()
    @IsOptional()
    readonly lastName: string;
    
    
    @IsOptional()
    readonly phoneNumber: string;
    
    
    @IsOptional()
    @IsGender({
        message: "The given gender does not exist"
    })
    readonly gender: Gender;
    
    
    @IsOptional()
    readonly commander: string;
    
    
    @IsOptional()
    @IsMajor({
        message: "The given major does not exist"
    })
    readonly major: Major;
}