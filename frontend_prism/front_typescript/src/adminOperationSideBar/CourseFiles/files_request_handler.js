import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";


async function getModulesByMajor(major) {

	let urlPostFix = "major/modules/" + major;

	return await sendGetRequest(urlPostFix);

}

async function getSubjectsByModule(major, module) {

	let urlPostFix = "subjects/" + major + "/" + module;

	return await sendGetRequest(urlPostFix);
}

async function getFilesBySubject(major, module, subject) {
	
	let urlPostFix = "files/" + major + "/" + module + "/" + subject;

	return await sendGetRequest(urlPostFix);
}

async function deleteModuleByMajor(listParams) {

	let urlPostFix = "module/"

	for (let param of listParams) {
		urlPostFix += param + "/";
	}

	// remove the last '/' from the string.
	urlPostFix = urlPostFix.slice(0, -1);

	return await sendDeleteRequest(urlPostFix);
}

async function deleteSubjectByModule(listParams) {
	
	let urlPostFix = "subject/"

	for (let param of listParams) {
		urlPostFix += param + "/";
	}

	// remove the last '/' from the string.
	urlPostFix = urlPostFix.slice(0, -1);

	return await sendDeleteRequest(urlPostFix);
}


async function sendGetRequest(urlPostFix) {

	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/file-handling/" + urlPostFix;

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

async function sendDeleteRequest(urlPostFix) {

	let token = LocalStorage.getItem(LocalStorage.token);

	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		let url = "http://localhost:4000/file-handling/" + urlPostFix;

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.delete(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}


export { getModulesByMajor, getSubjectsByModule, getFilesBySubject, deleteModuleByMajor,
		 deleteSubjectByModule };