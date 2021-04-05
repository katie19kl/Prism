import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import {getUserInfoByJWT } from '../../HelperJS/extract_info'

import { Link } from 'react-router-dom';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import DisplayUserData from "../../HelperFooStuff/DisplayUserData"



class AdminSettings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: undefined,
			major: undefined,
			firstName: undefined,
			gender: undefined,
			lastName: undefined,
			role: undefined,
			phone_number:undefined
		}
	}

	render() {




		// retrieve user info from server
		getUserInfoByJWT().then((user) => {

			if (user === undefined){
				
			}else {

				console.log("here user was given")
				user = user.data
				console.log(user)
				
				console.log(user["major"])

				let username_ = user["username"]
				let majors_ = user["major"]
				let role_ = user["role"]
				let firstName_ = user["firstName"]
				let lastName_ = user["lastName"]
				let phoneNum = user["phoneNumber"]
				let gender_ = user["gender"]
				
				// server answer differs from out current
				let wasChanges = (username_ !== this.state.username) 
				if (wasChanges){
					// it causes new rendering
					
					this.setState( {
									username : username_,
									major: majors_,
									role: role_,
									firstName: firstName_,
									lastName: lastName_,
									phone_number: phoneNum,
									gender: gender_,
									
						
									} )
				}

			}
		})
		if (this.state.username === undefined){
			return(
					<MenuAppBar menu={
						<CommanderMenu/>
					}></MenuAppBar>
			)
		}else {
			

			return(
					<MenuAppBar menu={
						<CommanderMenu/>
					}
					content={
						<div>

							<DisplayUserData  
							
								phone_number = {this.state.phone_number} 
								role = {this.state.role}
								lastName = {this.state.lastName}
								firstName = {this.state.firstName}
								gender = {this.state.gender}
								major = {this.state.major}
								username = {this.state.username}
								>

							</DisplayUserData>


							<Link to = "/admin/info_change" style={{ textDecoration: 'none'}}>
								<Button
									variant="contained"
									color="primary"
									size="large"
									startIcon={<SaveIcon />}>
										Update
								
								</Button>
							</Link>
						
							<Link to = "/admin" style={{ textDecoration: 'none'}}>
								<Button
									variant="contained"
									color="primary"
									size="large"
									startIcon={<LaptopMacIcon />}>
										Go to main
								
								</Button>
							</Link>
						

					</div>
						
					}>
					
					
					
		
					</MenuAppBar>


			
			
			)
		}
		
	}

}
	
export default (AdminSettings);