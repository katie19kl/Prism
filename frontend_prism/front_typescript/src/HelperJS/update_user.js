import axios from "axios";
import LocalStorage from "./LocalStorage";
import { prefix_server_url } from "./url_helper";


function update_fields(newUserName, newFirstName, newLastName,
	newPhoneNum, newPassword, newCommander) {

	let updatedUser = {};

	if (newUserName !== undefined && newUserName  !== "") {
		updatedUser["username"] = newUserName;
	}

	if (newFirstName !== undefined && newFirstName !== "") {
		updatedUser["firstName"] = newFirstName;
	}

	if (newLastName !== undefined && newLastName  !== "") {
		updatedUser["lastName"] = newLastName;
	}

	if (newPhoneNum !== undefined && newPhoneNum  !== "") {
		updatedUser["phoneNumber"] = newPhoneNum;
	}

	if (newPassword !== undefined && newPassword  !== "") {
		updatedUser["password"] = newPassword;
	}

	if (newCommander !== undefined && newCommander  !== "") {
		updatedUser["commander"] = newCommander;
	}
	
	return updatedUser;
}


async function updateUser(username, newUserName, newFirstName, 
	newLastName, newPhoneNum, newPassword, newCommander, me) {

	let updated_user_json = update_fields(newUserName, newFirstName,
		newLastName, newPhoneNum, newPassword, newCommander);

	let token = LocalStorage.getItem(LocalStorage.token);
	let url = prefix_server_url + "users/" + username 
	
	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
				},
			
		});

		return await req.put(url, updated_user_json)
			.then((response) => {
				
		
				if (newUserName !== undefined && newUserName !== "" && newUserName !== "undefined"){
					
					// if change my username => update local storage
					if (me){
	
						LocalStorage.setItem(LocalStorage.username, newUserName)
					}
				}
        
				return response;

		}, (error) => {
			return error;
		});
	}
}


export { updateUser }