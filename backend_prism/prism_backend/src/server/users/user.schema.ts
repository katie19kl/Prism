import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from './iuser.interface';
import { Role } from '../RolesActivity/role.enum';
import { Gender } from './common/gender.enum';


export const UserSchema = new mongoose.Schema({
    personalId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Role, 
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    gender: {
        type: Gender,
        required: true
    },
    commander: {
        type: String,
        required: false
    },
    major: {
        type: Array,
        required: false
    }
});


UserSchema.pre<IUser>('save', function(next) {

    let user = this;

    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) return next();

    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {

        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {

            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}); 


UserSchema.methods.checkPassword = function(password: string): Promise<boolean> {
    const user = <IUser>this;
  
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, isMatch) => {
            
            if (error) {
                reject(error);
            }
  
            resolve(isMatch);
        });
    });
};