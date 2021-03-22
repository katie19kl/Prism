import axios from "axios";
import React from "react";
import Login from "../Login/Login";
import ReactDOM from 'react-dom'
import {validateTokenFunc} from "../HelperJS/authentification_helper.js"

export default class LogINComp extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = { isLoggedIn: undefined, validateToken : validateTokenFunc };
	}
  

	goToMain() {
		
		const { history } = this.props;
		
		if (history) {
			history.push('/mainPage');
			//history.push('/about');
		}
	}



	componentDidMount() {
	
		console.log("	in  log in MOUNT");
			
		this.state.validateToken().then((isAuthenticated) => {

			console.log("--------authentification is done  with result-------- " + isAuthenticated)
			
			this.setState({isLoggedIn: isAuthenticated})
			
			
			if (isAuthenticated){
				this.goToMain()
			}
		})
	
	}


	render() {

		console.log("	%%% 	Log in rendering 	");
		let check = this.state.isLoggedIn;
		console.log("%%% 	is Logged in " + check);
		
		if (check === false ){
			return <Login />;
		}else {
			return null;
		}

	}
}
