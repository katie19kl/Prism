import React from "react";
import Login from "../Login/Login";
import { validateTokenFunc } from "../HelperJS/authentification_helper.js"


export default class LogINComp extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = { 
		
			isLoggedIn: undefined,
			validateToken : validateTokenFunc
		
		};
	}
  

	goToMain() {
		
		const { history } = this.props;
		
		if (history) {
			history.push('/mainPage');
			//history.push('/about');
		}
	}



	componentDidMount() {
	
			
		this.state.validateToken().then((isAuthenticated) => {

			
			this.setState({isLoggedIn: isAuthenticated})
			
			
			if (isAuthenticated){
				this.goToMain()
			}
		})
	
	}


	render() {

		let check = this.state.isLoggedIn;
		
		if (check === false ){
			return <Login />;
		} else {
			return null;
		}

	}
}
