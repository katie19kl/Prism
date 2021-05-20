import { Document } from 'mongoose'
import { Role } from '../RolesActivity/role.enum';
import { Major } from '../users/common/major.enum';


export interface IReview extends Document {

    // unique key- all four fields:
    soldierId: string;
    major : Major;
    module: string;
    subject: string;

    // grading. Might change to an enum {checked-is good, checked-to be fixed}.
    grade: string;

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
