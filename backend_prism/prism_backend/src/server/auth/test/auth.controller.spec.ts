import { HttpStatus } from '@nestjs/common';


const request = require('supertest');
const app = "http://localhost:4000";


describe('check login under different circumstances', () => {

    // When trying to login for the first time with
    // a valid username and pwd => successful login.
	it('check successful login for the first time', async () => {

        let loginObject = {
            username: "kety1",
            password: "123"
        };

		await request(app)
			.post('/auth/user')
			.send(loginObject)
			.expect(({statusCode, text}) => {

				expect(statusCode).toEqual(HttpStatus.CREATED);
                expect(text).toContain('username');
                expect(text).toContain('tokenInfo');
                expect(text).toContain('role');
                expect(text).toContain('expiresIn');
                expect(text).toContain('token');

			});
    });

    // check successful login given a valid token only.


    // check a failed login with a non existing user.


    // check a failed login with wrong pwd/username.


    // check a failed login with an invalid token.
});