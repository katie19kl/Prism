import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { getUserInfoByJWT } from '../../HelperJS/extract_info_by_token'
import { Link } from 'react-router-dom';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import { withStyles } from "@material-ui/core";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(30),
    },
    button: {
        marginLeft: theme.spacing(7),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        marginLeft: theme.spacing(15),
    }
});


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

		const { classes } = this.props;

		// retrieve user info from server
		getUserInfoByJWT().then((user) => {

			if (user === undefined){
				
			} else {

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
					<MenuAppBar menu={
						<CommanderMenu/>
					}></MenuAppBar>
			)
		} else {
			return (
					<MenuAppBar menu={
						<CommanderMenu/>
					}
					content={
					<div className={classes.root}>
					<h2 className={classes.myFont}>Your Current Info</h2>

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

						<br></br>
						<br></br>
						<Link to = "/admin/info_change" style={{ textDecoration: 'none'}}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.button}
								startIcon={<SaveIcon />}>
									Update
							</Button>
						</Link>
						
						<Link to = "/admin" style={{ textDecoration: 'none'}}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.button}
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
	
export default withStyles(useStyles, { withTheme: true })(AdminSettings);