import LocalStorage from "./LocalStorage";
import axios from "axios";
import { prefix_server_url } from "./url_helper";


async function sendCreateUserRequest(data) {

    console.log("here i am");

    //let url = "http://localhost:4000/users";
    let url = prefix_server_url + "users";
    
    

    let token = LocalStorage.getItem(LocalStorage.token);
    
    if (token === null || token === 'undefined') {

		// return the user to login.

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