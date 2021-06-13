import { HttpStatus } from '@nestjs/common';


//import * as request from 'supertest';
const request = require('supertest');

const app = "http://localhost:4000";


describe('checks returning admin permissions', () => {

	
	it('checks admin permissions', async () => {

		let roleCheck = { role: "admin" };
		let wrongRole = { role: "user" };


		// The controller receives the appropriate role => the user is allowed.
		await request(app)
			.get('/users/fooAdmin')
			.send(roleCheck)
			.expect((response) => {

				expect(response.statusCode).toEqual(HttpStatus.OK);
				expect(response.body).toEqual({allowed: true});
				expect(response.password).toBeUndefined();

			});


		// The controller does not receive a role at all => access is forbidden.
		await request(app)
			.get('/users/fooAdmin')
			.expect(({statusCode, body}) => {

				expect(statusCode).toEqual(HttpStatus.FORBIDDEN);
				expect(body.message).toEqual("Forbidden resource");

			});


		// The role received is not the appropriate one => access forbidden.
		await request(app)
			.get('/users/fooAdmin')
			.send(wrongRole)
			.expect((response) => {
				
				expect(response.statusCode).toEqual(HttpStatus.FORBIDDEN);
			});
		
	});
});


describe('checking user creation', () => {

	it('user creation', async () => {

		let user = {
			"username": "boris123",
			"password": "123",
			"role": "soldier",
			"firstName": "boris",
			"lastName": "Johnson",
			"gender": "male"
		};

		let badUser = {
			"username": "john",
			"password": "12"
		};


		// a successful creation of a user.
		await request(app)
			.post('/users')
			.send(user)
			.expect(({statusCode, body}) => {

				expect(statusCode).toEqual(HttpStatus.CREATED);
				expect(body.username).toBeDefined();
				expect(body.password).toBeDefined();
				expect(body.role).toBeDefined();
			});

		
		// creating user with an existing username => bad request.
		await request(app)
			.post('/users')
			.send(user)
			.expect(({statusCode, body}) => {

				expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
				expect(body.message).toEqual('Username already exists');

			})


		// trying to create a user, given a field is missing => forbidden action.
		await request(app)
			.post('/users')
			.send(badUser)
			.expect(({statusCode}) => {
				
				expect(statusCode).toEqual(HttpStatus.FORBIDDEN);
			})
	});
});

