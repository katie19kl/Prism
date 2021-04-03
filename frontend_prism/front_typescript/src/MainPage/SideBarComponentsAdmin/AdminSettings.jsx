import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../Components/MenuAppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import {getUserInfoByJWT } from '../../HelperJS/extract_info_by_token'

import { Link } from 'react-router-dom';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';


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
<<<<<<< HEAD




		// retrieve user info from server
		getUserInfoByJWT().then((user) => {

			if (user === undefined){
				
			}else {

				console.log("here user was given")
				user = user.data
				console.log(user)
				
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
				<div>
					<CssBaseline />
					<MenuAppBar></MenuAppBar>
				</div>
			)
		}else {
			

			return(
				<div>
					<CssBaseline />
					<MenuAppBar>
					<br></br>
					<h2>Here you see change your info</h2>
					<div>
						<TextField
							disabled id="standard-disabled" 
							variant="filled"
							label="username" 
							defaultValue= {this.state.username}>

						</TextField>
						
						
						<TextField
							disabled id="standard-disabled" 
							variant="filled"
							label="password" 
							defaultValue="******" >

						</TextField>

						
						
						
						<dd></dd>
						<br></br>
						
						<TextField	
									disabled id="standard-disabled" 	
									variant="filled"
									label="majors"
									defaultValue={this.state.major} >
						</TextField>

						
						<TextField	
									disabled id="standard-disabled" 	
									variant="filled"
									label="Gender"
									defaultValue={this.state.gender} >
						</TextField>




						<dd></dd>
						<br></br>

						<TextField 
							disabled id="standard-disabled"
							variant="filled"
							label="First Name" 
							defaultValue={this.state.firstName}>

						</TextField>

					
						<TextField 
							disabled id="standard-disabled"
							variant="filled"
							label="Last Name" 
							defaultValue={this.state.lastName}>

						</TextField>

						<dd></dd>
						<br></br>
						<TextField	
									disabled id="standard-disabled" 	
									variant="filled"
									label="Role"
									defaultValue={this.state.role} >
						</TextField>

						<TextField 
							disabled id="standard-disabled" 
							variant="filled"
							label="Phone number" 
							defaultValue={this.state.phone_number}>

						</TextField>

						<dd></dd>
						<br></br>
						<dd></dd>
						<br></br>
						<dd></dd>
						<br></br>
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
					
					
					
					
					</MenuAppBar>

				</div>

			
			
			)
		}
		
	}

=======
		return(
			<div>
				<CssBaseline />
				<MenuAppBar>
				<br></br>
				<br></br>
				<br></br>
				<br></br>
				<h2>Here you can change your info</h2>
				<div>
					<TextField 
						required id="standard-required"
						variant="filled"
						label="username" 
						defaultValue="username from server" >

					</TextField>
					
					<TextField 
						required id="standard-required"
						variant="filled"
						label="password" 
						defaultValue="******" >

					</TextField>
					
					<dd></dd>
					<br></br>
					
					<TextField	
								disabled id="standard-disabled" 	
								variant="filled"
								label="majors"
								defaultValue="megame from server" >
					</TextField>

					
					<TextField	
								disabled id="standard-disabled" 	
								variant="filled"
								label="Gender"
								defaultValue="Gender from server" >
					</TextField>

					<dd></dd>
					<br></br>

					<TextField 
						required id="standard-required"
						variant="filled"
						label="First Name" 
						defaultValue="Actual first name from server">

					</TextField>

					<TextField 
						required id="standard-required"
						variant="filled"
						label="Last Name" 
						defaultValue="Actual Last  name from server">

					</TextField>

					<dd></dd>
					<br></br>
					<TextField	
								disabled id="standard-disabled" 	
								variant="filled"
								label="Role"
								defaultValue="Role from server" >
					</TextField>

					<TextField 
						required id="standard-required"
						variant="filled"
						label="Phone number" 
						defaultValue="Phone Number from server">
					</TextField>

					<dd></dd>
					<br></br>
					<dd></dd>
					<br></br>
					<dd></dd>
					<br></br>
					<Button
						variant="contained"
						color="primary"
						size="large"
						className={useStyles.button}
						startIcon={<SaveIcon />}>
							Update
					
					</Button>
				</div>
				</MenuAppBar>
			</div>
		);
  	}
>>>>>>> 80e2a1e6c2ee19c655cfa956364a4c4e8c568705
}
	
export default (AdminSettings);