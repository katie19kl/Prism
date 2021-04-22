import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";


async function getModulesByMajor(major) {

	let urlPostFix = "modules/" + major;

	return await sendRequest(urlPostFix);

}

async function getSubjectsByModule(major, module) {

	let urlPostFix = "subjects/" + major + "/" + module;

	return await sendRequest(urlPostFix);
}

async function getFilesBySubject(major, module, subject) {
	
	let urlPostFix = "files_in_subject/" + major + "/" + module + "/" + subject;

	return await sendRequest(urlPostFix);
}


async function sendRequest(urlPostFix) {

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

export { getModulesByMajor, getSubjectsByModule, getFilesBySubject };