import axios from "axios";
import React from "react";
import Login from "../Login/Login";


export default class LogINComp extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = { isLoggedIn: undefined };
	}
  
	async validateToken()  {
	
		console.log("---------try to authentificate")
		
		let token = localStorage.getItem('token');
		
		if (token === null || token === 'undefined') {

			if (this.state.isLoggedIn != false) {
				this.setState({isLoggedIn: false});
			}

		} else {
	
			if (token[0] === '"' && token[token.length - 1] === '"') {
				token = token.substring(1, token.length - 1);
			}
			
			// send the token to the server and check its response.
			let url = "http://localhost:4000/auth/validate"; 
	
			const req = await axios.create({
				baseURL: url,
				timeout: 1000,
				headers: { 'Authorization': 'Bearer '+ token }
			});
	
			await req.get(url, {
			})
			.then((response) => {

				console.log(response);
		
				// response is ok.
				if (response.data.isValid) {
					console.log("I am authentificated !!!! in checking !!!!!!!!!!!!!!! ")
					
					if (this.state.isLoggedIn != true){
						//this.setState({isLoggedIn: true});// set state => re-rendering 
						this.goToMain()
					}  
	
				}
	
			},(error) => {
			
				// In case the token was "undefined".
				console.log("------------error in the 'else' scope, app: " + error);
				
				if (this.state.isLoggedIn != false) {
					this.setState({isLoggedIn: false});
				}
			});
	
		}
	}

	componentDidMount() {
		console.log("in mount ---------------------------------------------------");
		this.validateToken();
		console.log("in mount EXIT ------");
		
	}

	goToMain() {
		
		const { history } = this.props;
		
		if (history) {
			history.push('/mainPage');
		}
	}

	render() {
		console.log("-----inside LogINComp render()------");
		let check = this.state.isLoggedIn;
		console.log("before rendering(before return), isLoggedIn: " + check);
		
		if (check === undefined) {
			return null;
		}

		if (check === true) {
		
			return null;

		} else {
		
			return <Login />;
		}
	}
}
