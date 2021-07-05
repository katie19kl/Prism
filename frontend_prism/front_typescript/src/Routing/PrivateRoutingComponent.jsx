import React from "react";
import { Redirect, Route } from "react-router";
import Role from "./../Roles/Role"

import { validateTokenFunc, currentUserRole, validateRoleByToken} from "../HelperJS/authentification_helper"
import { getUserInfoByJWT } from "../HelperJS/extract_info";
import ContentOfModule from "../soldierOperationSideBar/soldierTasks/module/ContentOfModule";


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

	isNumeric(value) {
		return /^\d+$/.test(value);
	}

	hasNumber(myString) {
		return /\d/.test(myString);
	}


	retrievePersonalIdURL(pathContainingId){
		let parsedURL = pathContainingId.split("/")

		for (const partURL of parsedURL){
			
		
			if (this.hasNumber(partURL)){

				// if number & is not port number
				if (this.isNumeric(partURL) && partURL.length > 5){
					// Here we are sure that we have retrieved personal Id

					return partURL
				}
			}
		}
	}

	sameIdURLAndToken(personalId, pathContainingId){
		
		let idInUrl = this.retrievePersonalIdURL(pathContainingId)
		let userId = personalId



		// no personal id in url
		if (idInUrl === undefined){
			return true
		}
		
		// there is personal id in url
		if (userId === idInUrl){
			return true
		}
		


		return false


	}
  

	render() {




		let isLoggedIn = this.state.isLoggedIn;


		let rolesRequired = this.props.roles;
		let allowedToEveryOne = false;

		// role of current authentificated user
		let currentUserRole = this.state.getCurrRole();




		getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined){
				
			} else {

				
				user = user.data

				
				let role = user["role"]
				
				


				if (currentUserRole !== role){
					
					if (this.state.pretentAttempt !== true){

						this.setState({pretentAttempt: true})
					}
				}
				
				
				
			}
		})


		if(this.state.pretentAttempt === 555){
			return <h2>Soldier access not his page</h2>
		}




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

		
		//let path = this.props.path;


		
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
				
				//(resp + "---------I am here -----------")
				if (resp === false ){

		
					
					//return <h2> NIHUI PRETEND OKK ?</h2>
					this.setState({pretentAttempt: true})
				}
			});
		}




		// taking care of url with personalId
		// check only if user is soldier -> that it is his personal ID
		
		if (currentUserRole === Role.Soldier){
			getUserInfoByJWT().then((user) => {

				if (user === undefined || user.data === undefined){
					
				} else {
	
					
					user = user.data

					
					let personalId = user["personalId"]
					//let pathContainingId = this.props.path;
					let pathContainingId = window.location.pathname
					
		
					
					
					
				
					let allowed = this.sameIdURLAndToken(personalId, pathContainingId)
			
					if (!allowed){
						this.setState({pretentAttempt: 555})
					}
					
					
					
				}
			})
		}
		




		// if role of current user resides in roles restrictions
		let indexInRoles = rolesRequired.indexOf(currentUserRole);
		

		// not logged in system
		if (isLoggedIn === false) {

			return <Redirect to={{ pathname: '/login'}} />
		}

			

		// roles were specified & user's role does not presents 
		if (isLoggedIn === true && indexInRoles === -1 &&  allowedToEveryOne === false ){
			
		
			return (
				
				<Redirect to={{ pathname: '/noPermissions'}} />
			)
		}


		// has permission & is log_in
		if (isLoggedIn === true && (indexInRoles !== -1 || allowedToEveryOne))
		{
			return (
				<Route  path={this.props.path} exact={this.props.exact} component={this.props.component} />
			)  

		}

		return null;
	}
}
