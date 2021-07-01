import { withStyles, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from "react"
import SaveIcon from '@material-ui/icons/Save';
import { Button, Snackbar } from "@material-ui/core";
import { updateUser } from "../HelperJS/update_user"
import MuiAlert from '@material-ui/lab/Alert';
import { 
    isNumeric, 
    onlyLettersAndDigits, 
    checkPassword,
    isValidName 
} from '../HelperJS/validator';


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '30ch',
        },
    },
    padding: {
        flexGrow: 1,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(20),
    },
    myFont: {
        //fontFamily: "Comic Sans MS, Comic Sans, cursive",
		fontFamily: 'monospace'
    },
    select: {
        marginRight: theme.spacing(20),
    },
});


/* shows the alert msg when creation attempt is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class ChangeUserData extends React.Component {

	constructor(props) {
		super(props);
		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this);
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this);
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this);
		this.handleTextFieldChangeCommander = this.handleTextFieldChangeCommander.bind(this);
		this.handleTextFieldChangePassword = this.handleTextFieldChangePassword.bind(this);
		this.setUpdatedFieldsOfSoldier = this.props.setUpdatedFieldsOfSoldier;
		this.updateUserInfo = this.updateUserInfo.bind(this);
		this.handleResponse = this.handleResponse.bind(this);
		this.closgMsg = this.closgMsg.bind(this);

		this.toCommander = this.props.toCommander;

		this._username =  "";
		this._password = "";
		this._firstName = "";
		this._lastName = "";
		this._phone_number = "";
		this._commander = "";

		this.showMsg = false;
		this.msg = undefined;
		this.severity = undefined;

		this.state = {
			usernameErr: "",
            firstNameErr: "",
            lastNameErr: "",
            phoneNumberErr: "",
			passwordErr: "",
			commanderErr: "",

			open: false,
		};
    }

	updateUserInfo(event) {
        if (this.props.soldier_id_ !== undefined) {

			let newUserName = this._username;
			let newFirstName = this._firstName;
			let newLastName = this._lastName;
			let newPhoneNum = this._phone_number;
			let newPassword = this._password;
			let newCommander = this._commander;

			let usernameToChange = this.props.toChangeByUserName;
            
			updateUser(usernameToChange,newUserName, newFirstName, 
				newLastName, newPhoneNum, newPassword, newCommander, false)
			.then((res) => {
				if (res !== undefined) {
					
					let data = {};
					data.username = newUserName;
					data.firstName = newFirstName;
					data.lastName = newLastName;
					data.phoneNumber = newPhoneNum;
					data.commander = newCommander;

					// the function will update the view in case of successful update.
					this.handleResponse(res, data);
					this.showMsg = true;

					// clear the text-boxes:
					this._username = "";
					this._firstName = "";
					this._lastName = "";
					this._phone_number = "";
					this._commander = "";
					this._password = "";

					this.setState({ open: true });

				}
            });
        }        
    }

	handleResponse(res, data) {

		if (res !== undefined) {

			if (res.status !== undefined && res.status === 200) {
				this.msg = 'Updated successfully!';
				this.severity = 'success';

				// update parent fields
				this.setUpdatedFieldsOfSoldier(data);

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
			this.msg = "Failed to update the user, Please try again";
			this.severity = 'error';
		}
	}

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
            this._phone_number = val;
            this.setState({ phoneNumberErr: ""});
        
		} else if (val.length > 10) {
			this.setState({ phoneNumberErr: "The phone number is not valid" });
		}
	}

	handleTextFieldChangeCommander(event) {
		let val =  event.target.value;
		this._commander = val;

		if (val.length > 0) {

			if (!isNumeric(val)) {
				this.setState({
					commanderErr: "The commander's ID must contain only numbers"
				});
			
			} else {
				this._commander = val;
				this.setState({ commanderErr: "" });
			} 
		} else {
			this._commander = "";
			this.setState({ commanderErr: "" });
		}
	}

	closgMsg() {
		this.msg = undefined;
		this.severity = undefined;
		this.setState({ open: false });
	}


    render() {
		const { classes } = this.props;

		let buttonEnable = false;

		if (this.state.usernameErr === "" && this.state.firstNameErr === ""
			&& this.state.lastNameErr === "" && this.state.phoneNumberErr === ""
			&& this.state.passwordErr === "" && this.state.commanderErr === "") {

			buttonEnable = true;
		}

      	return (

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

				<Grid container item justify='center' alignItems='center' xs={12}>

					<h4 className={classes.myFont}><b> Here You Can Change Data </b></h4>
					<br/>

					<Grid container item justify='center' alignItems='center'>
						<TextField onChange={this.handleTextFieldChangeUsername}		
						variant="outlined"
						error={this.state.usernameErr.length === 0 ? false : true}
						helperText={this.state.usernameErr}
						value={this._username}
						label="Username">
						</TextField>

						<TextField
						disabled id="usrname"
						variant="filled"
						label="Username"
						value= {this.props.prev_username}>
						</TextField>
					</Grid>

					<br></br>
					<br></br>

					<Grid container item justify='center' alignItems='center'>
						<TextField onChange={this.handleTextFieldChangePassword}		
						variant="outlined"
						error={this.state.passwordErr.length === 0 ? false : true}
						helperText={this.state.passwordErr}
						label="Password"
						value={this._password}
						type="password">
						</TextField>

						<TextField
						disabled 
						id="pass" 
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
						error={this.state.firstNameErr.length === 0 ? false : true}
						helperText={this.state.firstNameErr}
						value={this._firstName}
						label="First Name">
						</TextField>
						
						<TextField 
						disabled id="first-name"
						variant="filled"
						label="First Name" 
						value={this.props.prev_firstName}>
						</TextField>
					</Grid>
					

					<br></br>
					<br></br>

					<Grid container item justify='center' alignItems='center'>
						<TextField onChange={this.handleTextFieldChangeLastName}
						variant="outlined"
						error={this.state.lastNameErr.length === 0 ? false : true}
						helperText={this.state.lastNameErr}
						value={this._lastName}
						label="Last Name">	
						</TextField>

						<TextField 
						disabled id="last-name"
						variant="filled"
						label="Last Name" 
						value={this.props.prev_lastName}>
						</TextField>
					</Grid>

					<br></br>
					<br></br>
					
					<Grid container item justify='center' alignItems='center'>
						<TextField onChange={this.handleTextFieldChangePhoneNum}
						variant="outlined"
						error={this.state.phoneNumberErr.length === 0 ? false : true}
						helperText={this.state.phoneNumberErr}
						value={this._phone_number}
						label="Phone Number">
						</TextField>

						<TextField 
						disabled id="phone-num" 
						variant="filled"
						label="Phone Number" 
						value={this.props.prev_phone_number}>
						</TextField>
					</Grid>

					<br></br>
					<br></br>

					{this.toCommander !== true ?
					<Grid container item justify='center' alignItems='center'>
						<TextField onChange={this.handleTextFieldChangeCommander}
						variant="outlined"
						error={this.state.commanderErr.length === 0 ? false : true}
						helperText={this.state.commanderErr}
						value={this._commander}
						label="Commander ID">
						</TextField>

						<TextField 
						disabled id="commander-id"
						variant="filled"
						label="Commander ID" 
						value={this.props.prev_commander}>
						</TextField>
					</Grid>
					: ''}

					<br></br>
					<br></br>
				

				</Grid>

				<Grid item container justify='center' alignItems='center'>
					
				<br></br>
				<br></br>
				<br></br>
				<br></br>

					<Button
					onClick={this.updateUserInfo}
					variant="contained"
					color="primary"
					size="large"
					disabled={!buttonEnable}
					startIcon={<SaveIcon />}>
						Update user info                    
					</Button>
				</Grid>

          </div>
      	);
    }
}

export default withStyles(useStyles, { withTheme: true })(ChangeUserData)