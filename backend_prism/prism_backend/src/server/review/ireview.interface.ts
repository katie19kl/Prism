import { Document } from 'mongoose'
import { Role } from '../RolesActivity/role.enum';
import { Grade } from '../users/common/grade.enum';
import { Major } from '../users/common/major.enum';


export interface IReview extends Document {

    // unique key- all four fields:
    soldierId: string;
    major : Major;
    module: string;
    subject: string;

    // grading
    grade: number;
    gradeDescription: Grade;

    // time of the review submitting.
    submittedDate: string;
    submittedTime: string;

    // commander/tester.
    checkerRole: Role;
    checkerId: string;

    // the review itself.
    comment: string;

    // define who can see the review
    showTo: Role[];
    
}
