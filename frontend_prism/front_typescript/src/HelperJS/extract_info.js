import axios from "axios";
import LocalStorage from "./LocalStorage";
import { prefix_server_url } from "./url_helper";


async function getUserInfoByJWT() {

	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/info_by_JWT";
		let url = prefix_server_url + "users/info_by_JWT";

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.get(url, {
		})
			.then((response) => {
				return response;

			}, (error) => {
				return undefined;
			});
	}
}

async function getUserInfoById(personalId) {

	let token = LocalStorage.getItem(LocalStorage.token);
	
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/" + personalId;
		let url = prefix_server_url + "users/" + personalId;
		

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.get(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}

async function getSoldiersByMajors(majors) {
	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/soldiers/majors";
		let url = prefix_server_url + "users/soldiers/majors";
		

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.post(url, majors, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}

async function getAllMySoldiers(major_selected){

	
	let token = LocalStorage.getItem(LocalStorage.token);
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/my_soldiers/" + major_selected;
		
		let url = prefix_server_url + "users/my_soldiers/" + major_selected;

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.get(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined
		});
	}

}

async function getAllSubmissionsInMajor(major_selected) {

	
	let token = LocalStorage.getItem(LocalStorage.token);
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {
		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/my_soldiers/" + major_selected;
		let url = prefix_server_url + "user-submission/" + major_selected;

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.get(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}

}


async function getAllUsersByRole(role) {

	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {
		
		let url = prefix_server_url + "users/all_users/" + role;

		console.log(url)

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.get(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}


export { getUserInfoByJWT, getUserInfoById, getSoldiersByMajors,
		 getAllMySoldiers, getAllSubmissionsInMajor, getAllUsersByRole }