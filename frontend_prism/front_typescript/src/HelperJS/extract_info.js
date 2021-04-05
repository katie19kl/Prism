import axios from "axios";
import LocalStorage from "./LocalStorage";


async function getUserInfoByJWT() {

	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/users/info_by_JWT";

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


async function getUserInfoById(personalId) {

	let token = LocalStorage.getItem(LocalStorage.token);
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {



		// send the token to the server and check its response.
		let url = "http://localhost:4000/users/" + personalId;

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

async function getSoldiersByMajor(major){
	let token = LocalStorage.getItem(LocalStorage.token);
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {



		// send the token to the server and check its response.
		let url = "http://localhost:4000/users/soldiers/" + major;

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


export  { getUserInfoByJWT, getUserInfoById, getSoldiersByMajor }