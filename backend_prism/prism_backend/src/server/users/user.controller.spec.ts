
import { HttpStatus } from '@nestjs/common';
import { response } from 'express';

//import * as request from 'supertest';
const request = require('supertest');


const app = "http://localhost:4000";


describe(' checks returning admin permissions', () => {

	
it('checks admin permissions', async () => {

			let role_check ={ role : "admin"}

			//let check1_true = await request(app).get('/users/fooAdmin')
			//						.send(role_check).expect("admin")


			await request(app).get('/users/fooAdmin')
									.send(role_check)
									.expect( ({text, statusCode, forbidden, password}) => {
										
										expect(text).toEqual('admin')
										expect(statusCode).toBe(HttpStatus.OK)
										expect(password).toBeUndefined()

									})



			await request(app).get('/users/fooAdmin').expect( ({body}) =>{
				expect(body.message).toEqual("Forbidden resource")
			})


		});
	});

