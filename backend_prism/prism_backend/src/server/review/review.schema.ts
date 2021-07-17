import * as mongoose from 'mongoose';
import { Role } from '../RolesActivity/role.enum';
import { Grade } from '../users/common/grade.enum';
import { Major } from '../users/common/major.enum';


// how it looks like in db
export const ReviewSchema = new mongoose.Schema({

    soldierId: {
        type: String,
        required: true
    },
    major: {
        type: Major,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: Number
    },
    gradeDescription: {
        type: Grade,
        required: true
    },
    submittedDate: {
        type: String
    },
    submittedTime: {
        type: String
    },

    // commander/tester.
    checkerRole: {
        required: true,
        type: Role
    },
    checkerId: {
        required: true,
        type: String
    },

    // the review itself.
    comment: { 
        required: true,
        type: String
    },

    // define who can see the review
    showTo: {
        required: true,
        type: Array
    }
});
