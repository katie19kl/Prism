import React from "react"
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { getUserInfoByJWT } from '../../HelperJS/extract_info'
import { Link } from 'react-router-dom';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import TesterMenu from '../../GeneralComponent/tester/TesterMenu';
import DisplayUserData from "../../HelperFooStuff/DisplayUserData"
import { Grid, withStyles } from "@material-ui/core";
import Role from "../../Roles/Role";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";


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
        //fontFamily: "Comic Sans MS, Comic Sans, cursive",
		fontFamily: 'monospace',
    },
});


class AdminSettings extends React.Component {

	constructor(props) {
		super(props);
		this.myRole = undefined;

		this.state = {
			username: undefined,
			major: undefined,
			firstName: undefined,
			gender: undefined,
			lastName: undefined,
			role: undefined,
			phone_number: undefined,
			personalId: undefined,
		}
	}

	render() {

		const { classes } = this.props;

		// retrieve user info from server
		getUserInfoByJWT().then((user) => {

			//if (user === undefined){
			if (user === undefined || user.data === undefined) {	
			} else {

				user = user.data;

				this.myRole = user["role"];

				let username_ = user["username"];
				let majors_ = user["major"];
				let role_ = user["role"];
				let firstName_ = user["firstName"];
				let lastName_ = user["lastName"];
				let phoneNum = user["phoneNumber"];
				let gender_ = user["gender"];
				let personalId_ = user["personalId"];
				
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
						personalId: personalId_,
					});
				}
			}
		});
		
		if (this.state.username === undefined) {

			return <WaiterLoading />;

		} else {

			let menu = undefined;
			if (this.myRole === Role.Commander || this.myRole === Role.Admin) {
				menu = <CommanderMenu />;
			} else {
				menu = <TesterMenu />;
			}
			
			return (
				<MenuAppBar menu={menu}
				role={this.myRole}
				content={
				<Grid>
					<br/>
					<br/>

					<DisplayUserData
						title={<Grid justify='center' alignItems='center' container item xs={12}>
							<h4 className={classes.myFont}><b> Your Current Info </b></h4>
						</Grid>}
						phone_number = {this.state.phone_number}
						role = {this.state.role}
						lastName = {this.state.lastName}
						firstName = {this.state.firstName}
						gender = {this.state.gender}
						major = {this.state.major}
						username = {this.state.username}
						personalId = {this.state.personalId}
						>

					</DisplayUserData>

					<br/>
					
					<Grid container justify='center' alignItems='center'>

						<Link to = "/admin" style={{ textDecoration: 'none'}}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								style={{backgroundColor: "red"}}
								startIcon={<LaptopMacIcon />}>
									<b>Go to main</b>
							</Button>
						</Link>

						<Link to = "/admin/info_change" style={{ textDecoration: 'none'}}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.button}
								startIcon={<SaveIcon />}>
									<b>Update</b>
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