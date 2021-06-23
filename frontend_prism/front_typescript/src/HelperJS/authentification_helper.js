import axios from "axios";
import Token from "./Token"
import LocalStorage from "./LocalStorage";


async function validateTokenFunc()  {

	
	let token = Token.getToken()
	
	if (token === null) {
		
		return false;

	} else {
    
		// send the token to the server and check its response.
		let url = "http://localhost:4000/auth/validate"; 

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: {'Authorization': 'Bearer '+ token}
		});

    	return await req.get(url, {
    	})
		.then((response) => {
			//console.log(" ======== in auth helper ======")
			//console.log(response);

			// response is ok.
			if (response.data.isValid) {
					
				return true;
		
			} else {
				
				return false
			}

		},(error) => {
      
			// In case the token was "undefined".
			console.log("false after server validation: " + error);
			
			//this.isAuthenticated = false;
			return false;
    	});
  	}
}


// if current role in local storage is allowed to access &
// corresponds to one associated with token in server
async function validateRoleByToken(rolesRequired){

	let token = Token.getToken()
	
	if (token === null) {
		
		return false;

	} else {
	
		let url = "http://localhost:4000/users/role_by_JWT"

		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: {'Authorization': 'Bearer '+ token}
		});
		
		return await req.get(url, {

		}).then((response) => {
			
			let role = LocalStorage.getItem(LocalStorage.role)
			let roleFromServer = response.data.role
			
			let indexInRoles = rolesRequired.indexOf(role);
			
			// if role in local storage corresponds to role associated 
			// with token in server 
			//// indexInRoles != -1 => current role is  allowed according to  list permitted roles 
			if (role === roleFromServer && (indexInRoles !== -1)){
				return true
			}

			return false 
			
		},(error) => {
			
			// server answer was bad
			return false;
    	});

	}
}


function currentUserRole(){

	let role = LocalStorage.getItem(LocalStorage.role);
	
	if (role === undefined || role === null) {
		role = " ";
	}
	return role;

}

function currentUserUsername() {

	let username = LocalStorage.getItem(LocalStorage.username);

	if (username === undefined || username === null) {
		username = " ";
	}

	return username;
}


export { validateTokenFunc, currentUserRole, validateRoleByToken,currentUserUsername }