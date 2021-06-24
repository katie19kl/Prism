import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {getUserInfoByJWT } from '../../HelperJS/extract_info'
import { Link } from 'react-router-dom';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import DisplayUserData from "../../HelperFooStuff/DisplayUserData"
import { Grid, withStyles } from "@material-ui/core";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    button: {
        marginLeft: theme.spacing(10),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
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

			//if (user === undefined){
			if (user === undefined || user.data === undefined){	
			} else {

				user = user.data;
				let username_ = user["username"];
				let majors_ = user["major"];
				let role_ = user["role"];
				let firstName_ = user["firstName"];
				let lastName_ = user["lastName"];
				let phoneNum = user["phoneNumber"];
				let gender_ = user["gender"];
				
				// server answer differs from out current
				let wasChanges = (username_ !== this.state.username);
				if (wasChanges) {

					// it causes new rendering
					this.setState( {
						username : username_,
						major: majors_,
						role: role_,
						firstName: firstName_,
						lastName: lastName_,
						phone_number: phoneNum,
						gender: gender_,
					});
				}
			}
		});
		
		if (this.state.username === undefined) {
			return (
				<MenuAppBar role = "Commander" menu={
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
				<Grid>
					<br/>
					<br/>

					<DisplayUserData
						title={<Grid justify='center' alignItems='center' container item xs={12}>
							<h4 className={classes.myFont}>Your Current Info</h4>
						</Grid>}
						phone_number = {this.state.phone_number} 
						role = {this.state.role}
						lastName = {this.state.lastName}
						firstName = {this.state.firstName}
						gender = {this.state.gender}
						major = {this.state.major}
						username = {this.state.username}
						>

					</DisplayUserData>

					<br/>
					
					<Grid container justify='center' alignItems='center'>
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
								className={classes.button}
								startIcon={<LaptopMacIcon />}>
									Go to main
							</Button>
						</Link>
					</Grid>

					<br></br>
					<br></br>
					<br/>
					<br/>
				</Grid>				
				}>
				</MenuAppBar>
			);
		}
	}
}
	
export default withStyles(useStyles, { withTheme: true })(AdminSettings);