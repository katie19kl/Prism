import * as mongoose from 'mongoose';
import { Major } from '../users/common/major.enum';

// how it looks like in db
export const UserSubmissionSchema = new mongoose.Schema({

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
    isChecked: {
        type: Boolean,
        required: true
    },

    // will be taken by scanning dir
    submittedFiles: {
        type: Array
    },
    gradeDescription: {
        //type: Grade
        type:String
    },
    submittedTime: {
        type:String
    },
    submittedDate: {
        type:String
    },
});
