import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from './iuser.interface';
import { Role } from '../authorization/role.enum';

export const UserSchema = new mongoose.Schema({
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
    }
});

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre<IUser>('save', function(next){

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