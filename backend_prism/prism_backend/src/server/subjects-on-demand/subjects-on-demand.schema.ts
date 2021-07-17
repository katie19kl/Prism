import * as mongoose from 'mongoose';


// how it looks like in db
export const SubjectsOnDemandSchema = new mongoose.Schema({

    soldierId: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    moduleToOpenedSubjects: {
        type: Map,
        of: Array,
        required: true
    },
    moduleToClosedSubjects: {
        type: Map,
        of: Array,
        required: true
    }
});
