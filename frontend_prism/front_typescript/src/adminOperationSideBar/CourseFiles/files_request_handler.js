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
///////////////////////
async function getFilesBySubject(major, module, subject) {
	
	let urlPostFix = "files/" + major + "/" + module + "/" + subject;

	return await sendGetRequest(urlPostFix);
}

async function deleteModuleByMajor(listParams) {

	let urlPostFix = "module/"

	let finalUrlPostfix = createUrlPostfix(urlPostFix, listParams);

	return await sendDeleteRequest(finalUrlPostfix);
}

async function deleteSubjectByModule(listParams) {
	
	let urlPostFix = "subject/";

	let finalUrlPostfix = createUrlPostfix(urlPostFix, listParams);

	return await sendDeleteRequest(finalUrlPostfix);
}

async function deleteFileBySubject(listParams) {

	let urlPostFix = "file/";

	let finalUrlPostfix = createUrlPostfix(urlPostFix, listParams);

	return await sendDeleteRequest(finalUrlPostfix);
}

function createUrlPostfix(initialPath, listParams) {

	let urlPostFix = initialPath;

	for (let param of listParams) {
		urlPostFix += param + "/";
	}

	// remove the last '/' from the string.
	urlPostFix = urlPostFix.slice(0, -1);

	return urlPostFix;
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

async function createModuleByMajor(major, moduleName) {

	let urlPostFix = "module/" + major + "/" + moduleName;

	return await sendPostRequest(urlPostFix);
}

async function createSubjectByModule(major, module, subjectName) {

	let urlPostFix = "subject/" + major + "/" + module + "/" + subjectName;

	return await sendPostRequest(urlPostFix);
}

async function renameModule(major, oldModule, newModule) {
	let urlPostFix = "module/rename/" + major + "/" + oldModule + "/" + newModule;

	return await sendPutRequest(urlPostFix);
}

async function renameSubject(major, module, oldSubject, newSubject) {

	let urlPostFix = "subject/rename/" + major + "/" + module 
		+ "/" + oldSubject + "/" + newSubject;

	return await sendPutRequest(urlPostFix);
}

async function sendPostRequest(urlPostFix) {

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

		return await req.post(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}

async function sendPutRequest(urlPostFix) {

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

		return await req.put(url, {
		})
		.then((response) => {

			return response;

		}, (error) => {
			return undefined;
		});
	}
}

export { getModulesByMajor, getSubjectsByModule, getFilesBySubject, deleteModuleByMajor,
		 deleteSubjectByModule, deleteFileBySubject, createModuleByMajor,
		 createSubjectByModule, renameModule, renameSubject };