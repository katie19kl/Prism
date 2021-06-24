import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";
import { prefix_server_url } from "../../HelperJS/url_helper";

export async function usersSubmissions(soldiers,major,module) {

	let token = LocalStorage.getItem(LocalStorage.token);
    
    // can be changed -- it should be one only
    let data_body = {"soldiers": soldiers}
 


	// User has no token
	if (token === null || token === 'undefined') {

		return false;

	} else {

		// send the token to the server and check its response.
		//let url = "http://localhost:4000/users/submissions/" + major + "/" + module ;
		let url = prefix_server_url	+ "users/submissions/" + major + "/" + module ;


		const req = await axios.create({
			baseURL: url,
			timeout: 1000,
            //data:{data_body},
  
            headers: { 'Authorization': 'Bearer ' + token }
		});

		return await req.post(url,data_body, {
		})
		.then((response) => {

			
			return response;

		}, (error) => {
			return undefined;
		});
	}
}



