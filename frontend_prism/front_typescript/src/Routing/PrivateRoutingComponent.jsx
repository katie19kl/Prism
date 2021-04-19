import React from "react";
import { Redirect, Route } from "react-router";

import { validateTokenFunc, currentUserRole, validateRoleByToken} from "../HelperJS/authentification_helper"


export default class PrivateRoutingComponent extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = {
			pretentAttempt: false,
			isLoggedIn: undefined, 
			validateToken : validateTokenFunc,
			getCurrRole : currentUserRole
		};
	}
  

	render() {

		// pretending attempt detection
		if (this.state.pretentAttempt){
			return <h2>DONT PRETEND PIDOR</h2>
		}

		// validate token with server
		this.state.validateToken().then((isAuthenticated) => {
			
			// server answer differs from out current
			if (isAuthenticated !== this.state.isLoggedIn)
			{

				this.setState({isLoggedIn: isAuthenticated})
			}
		})

		
		let path = this.props.path;
		let isLoggedIn = this.state.isLoggedIn;


		let rolesRequired = this.props.roles;
		let allowedToEveryOne = false;
		
		// no specified role restriction 
		if (rolesRequired === undefined) {
			rolesRequired = [];
			allowedToEveryOne = true;
		}
		else {

			//Call back validation --> if problem -> redirects to no permissions			
			// if role was defined, but user try to pretend 
			// with higher role. If it occurs => redirects to no permission
			validateRoleByToken(rolesRequired).then((resp) =>{
				console.log(resp + "---------I am here ")
				if (resp === false ){
					console.log("want to redirect this hara")
					//return <h2> NIHUI PRETEND OKK ?</h2>
					this.setState({pretentAttempt: true})
				}
			});
		}

		// role of current authentificated user
		let currentUserRole = this.state.getCurrRole();

		// if role of current user resides in roles restrictions
		let indexInRoles = rolesRequired.indexOf(currentUserRole);
		

		// not logged in system
		if (isLoggedIn === false) {

			return <Redirect to={{ pathname: '/login'}} />
		}

			

		// roles were specified & user's role doesnt presents 
		if (isLoggedIn === true && indexInRoles === -1 &&  allowedToEveryOne === false ){
			return (
				<Redirect to={{ pathname: '/noPermissions'}} />
			)
		}


		// has permission & is log_in
		if (isLoggedIn === true && (indexInRoles !== -1 || allowedToEveryOne))
		{
			console.log("is log in----------------=> redirects to " + path);
	
			return (
				<Route  path={this.props.path} exact={this.props.exact} component={this.props.component} />
			)  

		}

		return null;
	}
}
