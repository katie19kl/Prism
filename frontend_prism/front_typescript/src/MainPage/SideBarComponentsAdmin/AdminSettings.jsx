import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../Components/MenuAppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/styles';


const useStyles = (theme) => ({
	button: {
	  	margin: theme.spacing(1),
	},
});


class AdminSettings extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
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
}
	
export default withStyles(useStyles)(AdminSettings);