import * as bcrypt from 'bcrypt';

export class User extends Document {

<<<<<<< HEAD

    username: string;
    password: string;

=======
>>>>>>> 0ab74d62f603ca374449e40ee452d9c29e7c0090
    checkPassword(password: string, arg1: (err: any, isMatch: any) => void) {
        let user = this;

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return arg1(err, null);
            
            arg1(null, isMatch);
        });
    }
}