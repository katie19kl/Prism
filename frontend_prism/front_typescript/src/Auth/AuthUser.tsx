import axios from "axios";


const myAuth = {
	isAuthenticated: false,

	authenticate() {
		console.log("try to authentificate")
		let token = localStorage.getItem('token');
		
		if (token === null || token === 'undefined') {
			this.isAuthenticated = false;
		} else {

			if (token[0] === '"' && token[token.length - 1] === '"') {
				token = token.substring(1, token.length - 1);
			}
			
			// send the token to the server and check its response.
			let url = "http://localhost:4000/auth/helloJWT"; 

			const req = axios.create({
				baseURL: url,
				timeout: 1000,
				headers: {'Authorization': 'Bearer '+ token}
			});

			req.get(url, {
			})
			.then((response) => {
				console.log(response);

				// response is ok.
				if (response.data.isValid) {
					this.isAuthenticated = true;
				}

			},(error) => {
				
				// In case the token was "undefined".
				console.log("error in the 'else' scope, app: " + error);
				
			});
		}
	}
}

export default myAuth;