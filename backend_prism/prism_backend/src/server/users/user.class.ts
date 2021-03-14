import * as bcrypt from 'bcrypt';

export class User extends Document {


    username: string;
    password: string;

    checkPassword(password: string, arg1: (err: any, isMatch: any) => void) {
        let user = this;

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return arg1(err, null);
            
            arg1(null, isMatch);
        });
    }
}