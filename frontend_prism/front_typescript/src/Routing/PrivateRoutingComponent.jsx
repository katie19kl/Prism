import React from "react";
import { Redirect, Route } from "react-router";

import { validateTokenFunc, currentUserRole, currentUserUsername} from "../HelperJS/authentification_helper"

export default class PrivateRoutingComponent extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = { 
			isLoggedIn: undefined, 
			validateToken : validateTokenFunc,
			getCurrRole : currentUserRole
		};
	}
  

	render() {

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

		if (rolesRequired === undefined) {
			rolesRequired = [];
			allowedToEveryOne = true;
		}

		// role of current authentificated user
		let currentUserRole = this.state.getCurrRole();

		// if role of current user resides in roles restrictions
		let indexInRoles = rolesRequired.indexOf(currentUserRole);
		

		// not loged in system
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
