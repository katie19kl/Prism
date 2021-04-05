import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {getUserInfoByJWT } from '../../HelperJS/extract_info'

import { updateUser } from '../../HelperJS/update_user'
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";


export default class AdminSettings extends React.Component {
	constructor(props) {
		super(props);

		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this)
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this)
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this)


				
		this._username =  undefined
		this._firstName = undefined
		this._lastName = undefined
		this._phone_number = undefined

		
		this.updateMyInfo = this.updateMyInfo.bind(this)



		
		this.state = {


			prev_username: undefined,
			prev_firstName: undefined,
			prev_lastName: undefined,
			prev_phone_number:undefined
		}
	}

	handleTextFieldChangeUsername(event) {
		let input =  event.target.value
		//this.state.username = input
		this._username = input
	}

	handleTextFieldChangeFirstName(event) {
		let input =  event.target.value
		//this.state.firstName = input
		this._firstName = input
	}

	handleTextFieldChangeLastName(event) {
		let input =  event.target.value
		//this.state.lastName = input
		this._lastName = input
	}

	handleTextFieldChangePhoneNum(event){
		let input =  event.target.value
		//this.state.phone_number = input
		this._phone_number = input	
	}

	updateMyInfo() {
		// potential changes
		let newUserName = 	this._username
		let newPhoneNum = this._phone_number
		let newLastName = this._lastName
		let newFirstName = this._firstName

		// current user username
		let username = this.state.prev_username

		/////////////////////////////// updating user info in server
		updateUser(username,newUserName, newFirstName,newLastName, newPhoneNum).then(
			(res) =>
			{
				if (res !== undefined){
					
					console.log(res)
					window.location.reload(false)
					
				}
				
			}
			
		)


	}


	render() {

		getUserInfoByJWT().then((user) => {

			if (user === undefined){
				
			}else {

				console.log("here user was given")
				user = user.data
				console.log(user)
				
				let username_ = user["username"]
				let firstName_ = user["firstName"]
				let lastName_ = user["lastName"]
				let phoneNum = user["phoneNumber"]

				let wasChanges = (username_ !== this.state.prev_username) 
				if (wasChanges){
					
					this.setState( 
						{
						prev_username : username_,
						prev_firstName: firstName_,
						prev_lastName: lastName_,
						prev_phone_number: phoneNum		
						})
				}
			}
		});
		
		if (this.state.prev_username === undefined){
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
							<TextField onChange={this.handleTextFieldChangeUsername}
								
								variant="filled"
								label="username" 
							>

					</TextField>


					<TextField
								disabled id="standard-disabled" 
								variant="filled"
								label="username" 
								defaultValue= {this.state.prev_username}>

					</TextField>
					<br></br>
					<br></br>
					
					<TextField onChange={this.handleTextFieldChangeFirstName}
								
								variant="filled"
								label="First Name" 
								>
	
					</TextField>

					
					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="First Name" 
								defaultValue={this.state.prev_firstName}>

					</TextField>
					

					<br></br>
					<br></br>

					<TextField onChange={this.handleTextFieldChangeLastName}
								
								variant="filled"
								label="Last Name" 
								>
	
					</TextField>


					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="Last Name" 
								defaultValue={this.state.prev_lastName}>

					</TextField>

					<br></br>
					<br></br>
					

					<TextField onChange={this.handleTextFieldChangePhoneNum}
								
								variant="filled"
								label="Phone num" 
								>
	
					</TextField>

					<TextField 

								disabled id="standard-disabled" 
								variant="filled"
								label="Phone number" 
								defaultValue={this.state.prev_phone_number}>

					</TextField>

					<br></br>
					<br></br>


					<h3>YOUR PREV DATA</h3>



	
					<Button
								onClick={this.updateMyInfo}
								variant="contained"
								color="primary"
								size="large"
								startIcon={<SaveIcon />}>
								Update new info
								
					</Button>

						<h2>CHANGE FIELDS INFO</h2>
				
						</div>
					}>
					
					</MenuAppBar>


				

			)
		}
	}
}

	