import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {getUserInfoByJWT } from '../../HelperJS/extract_info'
import { updateUser } from '../../HelperJS/update_user'
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import { Grid, withStyles } from "@material-ui/core";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '25ch',
        },
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
});


class ChangeAdminSettings extends React.Component {
	constructor(props) {
		super(props);

		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this);
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this);
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this);
		this._username =  undefined;
		this._firstName = undefined;
		this._lastName = undefined;
		this._phone_number = undefined;
		this.updateMyInfo = this.updateMyInfo.bind(this);

		this.state = {
			prev_username: undefined,
			prev_firstName: undefined,
			prev_lastName: undefined,
			prev_phone_number:undefined
		};
	}

	handleTextFieldChangeUsername(event) {
		let input =  event.target.value;
		this._username = input;
	}

	handleTextFieldChangeFirstName(event) {
		let input =  event.target.value;
		this._firstName = input;
	}

	handleTextFieldChangeLastName(event) {
		let input =  event.target.value;
		this._lastName = input;
	}

	handleTextFieldChangePhoneNum(event) {
		let input =  event.target.value;
		this._phone_number = input;
	}

	updateMyInfo() {
		// potential changes
		let newUserName = 	this._username;
		let newPhoneNum = this._phone_number;
		let newLastName = this._lastName;
		let newFirstName = this._firstName;

		// current user username
		let username = this.state.prev_username;

		/////////////////////////////// updating user info in server
		updateUser(username, newUserName, newFirstName, newLastName, newPhoneNum, true)
		.then((res) => {
				if (res !== undefined) {
					
					window.location.reload(false)
				}
		});
	}

	render() {
		const { classes } = this.props;

		getUserInfoByJWT().then((user) => {

			if (user === undefined) {
				
			} else {

				user = user.data;				
				let username_ = user["username"];
				let firstName_ = user["firstName"];
				let lastName_ = user["lastName"];
				let phoneNum = user["phoneNumber"];

				let wasChanges = (username_ !== this.state.prev_username) ;
				if (wasChanges) {
					
					this.setState({
						prev_username : username_,
						prev_firstName: firstName_,
						prev_lastName: lastName_,
						prev_phone_number: phoneNum		
					});
				}
			}
		});
		
		if (this.state.prev_username === undefined) {
			return (
				<MenuAppBar role = {"Commander"} menu={
					<CommanderMenu/>
				}></MenuAppBar>
			);

		} else {
			return (
				<MenuAppBar menu={
					<CommanderMenu/>
				}
				role = "Commander" 
				content={
					<div className={classes.root}>

						<br/>

						<Grid container justify='center' alignItems='center'>
						
							<Grid container item justify='center' alignItems='center'>
								<h3 className={classes.myFont}>
									Enter the fields you would like to update
								</h3>
							</Grid>

							<br/>

							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangeUsername}
								variant="filled"
								label="Username">
								</TextField>

								<TextField
								disabled id="standard-disabled" 
								variant="filled"
								label="Username" 
								defaultValue= {this.state.prev_username}>
								</TextField>
								
							</Grid>

							<br></br>
							<br></br>
					
							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangeFirstName}								
								variant="filled"
								label="First Name">
								</TextField>

								<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="First Name" 
								defaultValue={this.state.prev_firstName}>
								</TextField>
								
							</Grid>

							<br></br>
							<br></br>

							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangeLastName}
								variant="filled"
								label="Last Name">
								</TextField>

								<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="Last Name" 
								defaultValue={this.state.prev_lastName}>
								</TextField>

							</Grid>

							<br></br>
							<br></br>
					
							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangePhoneNum}
								variant="filled"
								label="Phone Number" >
								</TextField>

								<TextField 
								disabled id="standard-disabled" 
								variant="filled"
								label="Phone Number" 
								defaultValue={this.state.prev_phone_number}>
								</TextField>

							</Grid>

							<Grid container item justify='center' alignItems='center'>

								<Button
								onClick={this.updateMyInfo}
								variant="contained"
								color="primary"
								size="large"
								startIcon={<SaveIcon />}>
									Update new info	
								</Button>	
							
							</Grid>
						</Grid>
					</div>
				}>
				</MenuAppBar>
			);
		}
	}
}

export default withStyles(useStyles, { withTheme: true })(ChangeAdminSettings)
	