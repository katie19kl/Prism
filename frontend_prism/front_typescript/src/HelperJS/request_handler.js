import LocalStorage from "./LocalStorage";
import axios from "axios";


async function sendCreateUserRequest(data) {

    console.log("here i am");

    let url = "http://localhost:4000/users";

    let token = LocalStorage.getItem(LocalStorage.token);
    
    if (token === null || token === 'undefined') {

		// return the user the login.

	} else {

        let req = axios.create({
			baseURL: url,
			timeout: 3000,
			headers: { 
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
		});

        return await req.post(url, data)
        .then((response) => {
            
            return response;
        
        }, (error) => {
        
            return error;
        
        });
    }

}

export { sendCreateUserRequest };