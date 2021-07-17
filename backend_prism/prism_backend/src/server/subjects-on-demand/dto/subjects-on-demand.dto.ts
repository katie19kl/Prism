import { IsNotEmpty, IsNumberString } from "class-validator";
import { Major } from "../../users/common/major.enum";


export class CreateSubjectsOnDemandDto {
    
    @IsNotEmpty()
    @IsNumberString()
    soldierId: string;

    @IsNotEmpty()
    major: Major;

    moduleToOpenedSubjects: Map<string, Array<string>>;

    moduleToClosedSubjects: Map<string, Array<string>>;
}
