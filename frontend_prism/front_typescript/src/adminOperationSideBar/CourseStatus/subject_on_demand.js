import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";
import {prefix_server_url} from "./../../HelperJS/url_helper"


async function openSubjectToSoldier(soldierId, major, module, subjectToOpen) {

	let token = LocalStorage.getItem(LocalStorage.token);
    
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/subjects-on-demand/open/" + major + "/" + module + "/" + subjectToOpen + "/" + soldierId;

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
            headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.post(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}

}


async function closeSubjectToSoldier(soldierId, major,module, subjectToClose){
	let token = LocalStorage.getItem(LocalStorage.token);
    
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/subjects-on-demand/close/" + major + "/" + module + "/" + subjectToClose + "/" + soldierId;

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
            headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.post(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}


async function getSoldierClosedSubjects(major,module, soldiers){


	let data_body = {"soldiers": soldiers}

	let token = LocalStorage.getItem(LocalStorage.token);
    
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/subjects-on-demand/user_closed/" + major + "/" + module + "/";

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
            headers: { 'Authorization': 'Bearer ' + token }
		});
//24 + 9 ---> 33*29.19
		return await req.post(url,data_body, {
		})
		.then((response) => {
			console.log("-------------")
			console.log("-------------")
			
			console.log(response.data)

			return response;

		}, (error) => {
			return undefined;
		});
	}

}


async function getAllowedSubjectsOfUser(major, module, peronalId){


	let token = LocalStorage.getItem(LocalStorage.token);
    
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/subjects-on-demand/user_opened/" + major + "/" + module + "/" + peronalId;
		let url = prefix_server_url + "subjects-on-demand/user_opened/" + major + "/" + module + "/" + peronalId;


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


export { openSubjectToSoldier, getSoldierClosedSubjects, closeSubjectToSoldier,getAllowedSubjectsOfUser}


