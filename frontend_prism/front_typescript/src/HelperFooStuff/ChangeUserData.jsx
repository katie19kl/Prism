import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from "react"
import SaveIcon from '@material-ui/icons/Save';
import { Button} from "@material-ui/core";
import {updateUser} from "../HelperJS/update_user"


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '20ch',
        },
        //marginTop: theme.spacing(3),
        marginLeft: theme.spacing(10),
    },
    padding: {
        flexGrow: 1,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(10),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        marginLeft: theme.spacing(8),
        marginTop: theme.spacing(2),
    },
    select: {
        marginRight: theme.spacing(20),
    }
});


class ChangeUserData extends React.Component {

	constructor(props) {
		super(props);

		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this)
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this)
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this)


		this.updateUserInfo = this.updateUserInfo.bind(this)
		this._username =  undefined
		this._firstName = undefined
		this._lastName = undefined
		this._phone_number = undefined

		

    }

	updateUserInfo(event) {
		console.log("-----------------------")
		console.log(event)

		console.log("---*-**-*-*-*---------")
        if (this.props.soldier_id_ !== undefined){

			let newUserName = this._username
			let newFirstName = this._firstName
			let newLastName = this._lastName
			let newPhoneNum = this._phone_number

			let usernameToChange = this.props.toChangeByUserName
            
			updateUser(usernameToChange,newUserName, newFirstName,newLastName, newPhoneNum, false).then(
                (res) => {
                    if (res !== undefined) {
                        
                        console.log(res)
                        window.location.reload(false)
                    }
                }
                
            )
            

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


    render() {

		const { classes } = this.props;

      return (

			<div className={classes.root}>
                    <h3 className={classes.myFont}> Here You Can Change Data </h3>
					<TextField onChange={this.handleTextFieldChangeUsername}
								
								variant="filled"
								label="username" 
                                >

					</TextField>


					<TextField
								disabled id="standard-disabled" 
								variant="filled"
								label="username"
								defaultValue= {this.props.prev_username}>

					</TextField>
					<br></br>
					<br></br>
					
					<TextField onChange={this.handleTextFieldChangeFirstName}
								
								variant="filled"
								label="First Name" >
	
					</TextField>

					
					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="First Name" 
								defaultValue={this.props.prev_firstName}>

					</TextField>
					

					<br></br>
					<br></br>

					<TextField onChange={this.handleTextFieldChangeLastName}
								
								variant="filled"
								label="Last Name" >
	
					</TextField>


					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="Last Name" 
								defaultValue={this.props.prev_lastName}>

					</TextField>

					<br></br>
					<br></br>
					

					<TextField onChange={this.handleTextFieldChangePhoneNum}
								
								variant="filled"
								label="Phone num" >
	
					</TextField>

					<TextField 

								disabled id="standard-disabled" 
								variant="filled"
								label="Phone number" 
								defaultValue={this.props.prev_phone_number}>

					</TextField>

					<br></br>
					<br></br>
					<Button
                                        onClick={this.updateUserInfo}
                                        variant="contained"
                                        className={classes.padding}
                                        color="primary"
                                        size="large"
                                        startIcon={<SaveIcon />}>
                                        Update user info
                                            
                    </Button>



          </div>

      )
    }
}

export default withStyles(useStyles, { withTheme: true })(ChangeUserData)