import { Document } from 'mongoose'
import { Major } from '../users/common/major.enum';


export interface ISubjectsOnDemand extends Document {

    // unique key- all four fields:
    soldierId: string;
    
    major: Major;

    moduleToOpenedSubjects: Map<string, Array<string>>;

    moduleToClosedSubjects: Map<string, Array<string>>;
    
}
