import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {getUserInfoByJWT } from '../../HelperJS/extract_info'
import { updateUser } from '../../HelperJS/update_user'
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import { Grid, withStyles, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { 
    isNumeric, 
    onlyLettersAndDigits, 
    checkPassword,
    isValidName
} from '../../HelperJS/validator';
import Role from "../../Roles/Role";
import TesterMenu from "../../GeneralComponent/tester/TesterMenu";
import WaiterLoading from "../../HelperComponentStuff/WaiterLoading";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '30ch',
        },
    },
    myFont: {
        //fontFamily: "Comic Sans MS, Comic Sans, cursive",
		fontFamily: 'monospace',
	},
	padding: {
		marginTop: theme.spacing(5),
	}
});


/* shows the alert msg when creation attempt is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class ChangeAdminSettings extends React.Component {

	constructor(props) {
		super(props);

		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this);
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this);
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this);
		this.handleTextFieldChangePassword = this.handleTextFieldChangePassword.bind(this);
		this.updateMyInfo = this.updateMyInfo.bind(this);
		this.setPrevValues = this.setPrevValues.bind(this);
		this.handleResponse = this.handleResponse.bind(this);
		this.closgMsg = this.closgMsg.bind(this);

		this._username =  "";
		this._password = "";
		this._firstName = "";
		this._lastName = "";
		this._phone_number = "";
		this.msg = undefined;
		this.severity = undefined;
		this.showMsg = false;
		
		this.myRole = undefined;

		this.state = {
			prev_username: undefined,
			prev_firstName: undefined,
			prev_lastName: undefined,
			prev_phone_number: undefined,

            usernameErr: "",
            firstNameErr: "",
            lastNameErr: "",
            phoneNumberErr: "",
			passwordErr: "",

			open: false,
		};
	}

	// username changes
	handleTextFieldChangeUsername(event) {
		let input =  event.target.value;
		this._username = input;

		if (input.length > 0) {
			if (!onlyLettersAndDigits(input)) {
				this.setState({ usernameErr: "Username must contain only numbers and digits"});
			
			} else {
				this._username = input;
				this.setState({ usernameErr: "" });
			} 
		} else {
			this._username = "";
			this.setState({ usernameErr: "" });
		} 
	}
	// password changes
	handleTextFieldChangePassword(event) {
		let val = event.target.value;
        this._password = val;

		if (val.length > 0) {

			if (!checkPassword(val)) {
				this.setState({ 
					passwordErr: "Should have: one Uppercase letter, " +
						"one lowercase, one digit, length in range 6-20"
				});
			
			} else {
				this._password = val;
				this.setState({ passwordErr: "" });
			} 
		} else {
			this._password = "";
			this.setState({ passwordErr: "" });
		}
	}
	// firstname changes
	handleTextFieldChangeFirstName(event) {
		let val =  event.target.value;
		this._firstName = val;

		if (val.length > 0) {
			if (!isValidName(val)) {
				this.setState({ 
					firstNameErr: "First name must contain letters only"
				});
			
			} else {
				this._firstName = val;
				this.setState({ firstNameErr: "" });
			} 
		} else {
			this._firstName = "";
			this.setState({ firstNameErr: "" });
		}

	}

	// lastname changes
	handleTextFieldChangeLastName(event) {
		let val =  event.target.value;
		this._lastName = val;

		if (val.length > 0) {

			if (!isValidName(val)) {
				this.setState({ 
					lastNameErr: "Last name must contain letters only"
				});
			
			} else {
				this._lastName = val;
				this.setState({ lastNameErr: "" });
			}
		} else {
			this._lastName = "";
			this.setState({ lastNameErr: "" });
		}
	}

	
	// phone changes
	handleTextFieldChangePhoneNum(event) {
		let val =  event.target.value;
		this._phone_number = val;

		if (val.length > 0 && val.length < 10) {
            this.setState({ phoneNumberErr: "The phone number is not valid" });

        } else if (val.length === 10) {

            if (!isNumeric(val)) {
                this.setState({ phoneNumberErr: "The phone number is not valid" });

            } else {
                this.phoneNumber = val;
                this.setState({ phoneNumberErr: "" });

            }
        } else if (val.length === 0) {
            this._phone_number = "";
            this.setState({ phoneNumberErr: ""});
        
		} else if (val.length > 10) {
			this.setState({ phoneNumberErr: "The phone number is not valid" });
		}
	}

	updateMyInfo() {

		// potential changes
		let newUserName = 	this._username;
		let newPhoneNum = this._phone_number;
		let newLastName = this._lastName;
		let newFirstName = this._firstName;
		let newPassword = this._password;

		// current user username
		let username = this.state.prev_username;

		updateUser(username, newUserName, newFirstName, newLastName, newPhoneNum, newPassword,
			undefined, true)
		.then((res) => {

			this._username = "";
			this._firstName = "";
			this._lastName = "";
			this._phone_number = "";
			this._password = "";

			this.handleResponse(res);

			this.showMsg = true;
			this.setState({ open: true });
		});
	}

	setPrevValues() {
		getUserInfoByJWT().then((user) => {

			if (user === undefined) {
				
			} else {

				user = user.data;
				this.myRole = user["role"];
				
				let username_ = user["username"];
				let firstName_ = user["firstName"];
				let lastName_ = user["lastName"];
				let phoneNum = user["phoneNumber"];

				let wasChanges = (username_ !== this.state.prev_username
					|| firstName_ !== this.state.prev_firstName
					|| lastName_ !== this.state.prev_lastName 
					|| phoneNum !== this.state.prev_phone_number);


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
	}

	handleResponse(res) {
		if (res !== undefined) {

			if (res.status !== undefined && res.status === 200) {
				this.msg = 'Updated successfully!';
				this.severity = 'success';
			} else {

				if (res.response !== undefined) {

					if (res.response.data !== undefined) {

						if (res.response.data.message !== undefined) {
							this.msg = res.response.data.message;
						} else {
							this.msg = "Failed to update, please try again";
						}
					} else {
						this.msg = "Failed to update, please try again";
					}
				} else {
					this.msg = "Failed to update, please try again";
				}
				this.severity = 'error';
			}

		} else {
			this.msg = 'Failed to update, please try again';
			this.severity = 'error';
		}
	}

	closgMsg() {
		this.msg = undefined;
		this.severity = undefined;
		this.setState({ open: false });
	}

	render() {
		const { classes } = this.props;

		this.setPrevValues();

		let buttonEnable = false;

		if (this.state.usernameErr === "" && this.state.firstNameErr === ""
			&& this.state.lastNameErr === "" && this.state.phoneNumberErr === ""
			&& this.state.passwordErr === "") {

			buttonEnable = true;
		}
        		
		if (this.state.prev_username === undefined) {

			// show loading since the response was not received yet.
			return <WaiterLoading />;

		} else {

			let menu = undefined;
			if (this.myRole === Role.Commander || this.myRole === Role.Admin) {
				menu = <CommanderMenu />;
			} else {
				menu = <TesterMenu />
			}

			return (
				<MenuAppBar menu={menu}
				role={this.myRole}
				content={
					<div className={classes.root}>

						{(this.showMsg) 
						? <Snackbar open={this.state.open}
						autoHideDuration={3000}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						onClose={this.closgMsg}>
							<Alert onClose={this.closgMsg} severity={this.severity}>
								{this.msg}
							</Alert>
						</Snackbar> : ""}

						<br/>
						<br/>

						<Grid container justify='center' alignItems='center'>
						
							<Grid container item justify='center' alignItems='center'>
								<h4 className={classes.myFont}>
									<b> Enter the fields you would like to update </b>
								</h4>
							</Grid>

							<br/>

							<Grid container item justify='center' alignItems='center' className={classes.padding}>

								<TextField onChange={this.handleTextFieldChangeUsername}
								variant="outlined"
								error={this.state.usernameErr.length === 0 ? false : true}
								helperText={this.state.usernameErr}
								value={this._username}
								label="Username">
								</TextField>

								<TextField
								disabled id="usr-name" 
								variant="filled"
								label="Username" 
								value= {this.state.prev_username}>
								</TextField>
								
							</Grid>

							<br></br>
							<br></br>

							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangePassword}
								variant="outlined"
								error={this.state.passwordErr.length === 0 ? false : true}
								helperText={this.state.passwordErr}
								value={this._password}
								type="password"
								label="Password">
								</TextField>

								<TextField 
								disabled id="passwrd" 
								variant="filled"
								label="Password"
								defaultValue="*****">
								</TextField>

							</Grid>

							<br></br>
							<br></br>
					
							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangeFirstName}								
								variant="outlined"
								value={this._firstName}
								error={this.state.firstNameErr.length === 0 ? false : true}
								helperText={this.state.firstNameErr}
								label="First Name">

								</TextField>

								<TextField 
								disabled id="first_name"
								variant="filled"
								label="First Name" 
								value={this.state.prev_firstName}>
								</TextField>
								
							</Grid>

							<br></br>
							<br></br>

							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangeLastName}
								variant="outlined"
								value={this._lastName}
								error={this.state.lastNameErr.length === 0 ? false : true}
								helperText={this.state.lastNameErr}
								label="Last Name">
								</TextField>

								<TextField 
								disabled id="last_name"
								variant="filled"
								label="Last Name" 
								value={this.state.prev_lastName}>
								</TextField>

							</Grid>

							<br></br>
							<br></br>
					
							<Grid container item justify='center' alignItems='center'>

								<TextField onChange={this.handleTextFieldChangePhoneNum}
								variant="outlined"
								value={this._phone_number}
								error={this.state.phoneNumberErr.length === 0 ? false : true}
								helperText={this.state.phoneNumberErr}
								label="Phone Number">
								</TextField>

								<TextField 
								disabled id="phone" 
								variant="filled"
								label="Phone Number"
								value={this.state.prev_phone_number}>
								</TextField>

							</Grid>

							<Grid container item justify='center' alignItems='center'>

								<Button
								onClick={this.updateMyInfo}
								variant="contained"
								color="primary"
								size="large"
								disabled={!buttonEnable}
								className={classes.padding}
								startIcon={<SaveIcon />}>
									<b>Update new info</b>	
								</Button>	
							
							</Grid>
						</Grid>

						<br/>
						<br/>
						<br/>
					</div>
				}>
				</MenuAppBar>
			);
		}
	}
}

export default withStyles(useStyles, { withTheme: true })(ChangeAdminSettings)
	