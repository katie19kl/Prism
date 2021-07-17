import LocalStorage from "../../../HelperJS/LocalStorage";
import axios from 'axios';
import { prefix_server_url } from "../../../HelperJS/url_helper";

async function deleteUserByPersonalId(personalId) {
	let token = LocalStorage.getItem(LocalStorage.token);
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/" + personalId;
		let url = prefix_server_url	+ "users/" + personalId;

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

export { deleteUserByPersonalId };