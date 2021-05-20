import React from "react"
import { getUserInfoByJWT } from './../../HelperJS/extract_info'
import  DisplayUserData from './../../HelperFooStuff/DisplayUserData'
import SoldierMenu from "../../GeneralComponent/soldier/SoldierMenu";
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import { withStyles, Grid } from "@material-ui/core";

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
        marginLeft: theme.spacing(6),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(5),
    },
});


class SoldierInfo extends React.Component {

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

        getUserInfoByJWT().then((user) => {
    
            if (user === undefined){
                
            } else {

                console.log("here user was given")
                user = user.data
                console.log(user)
                
                console.log(user["major"])

                let username_ = user["username"]
                let majors_ = user["major"]
                let role_ = user["role"]
                let firstName_ = user["firstName"]
                let lastName_ = user["lastName"]
                let phoneNum = user["phoneNumber"]
                let gender_ = user["gender"]

                // server answer differs from out current
                
                let wasChanged = (username_ !== this.state.username) 
                if (wasChanged){
                    // it causes new rendering

                    this.setState({
                                    
                        username : username_,
                        major: majors_,
                        role: role_,
                        firstName: firstName_,
                        lastName: lastName_,
                        phone_number: phoneNum,            
                        gender: gender_,
                        
                    })
                }

            }
        })

        if (this.state.username === undefined) {

            return (
                <MenuAppBar menu={
                    <SoldierMenu/>
                }></MenuAppBar>
            );
        } else {

            return (
                <MenuAppBar
                    role = {"Soldier"}
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                    <Grid container justify='center' alignItems='center'>

                        <br/>
                        <br/>
                        <br/>

                        <DisplayUserData
                            title={
                                <Grid justify='center' alignItems='center' container item xs={12}>
                                    <h4 className={classes.myFont}>Your Current Info</h4>
                                </Grid>
                            }
                            phone_number = {this.state.phone_number} 
                            role = {this.state.role}
                            lastName = {this.state.lastName}
                            firstName = {this.state.firstName}
                            gender = {this.state.gender}
                            major = {this.state.major}
                            username = {this.state.username}
                            >
                        </DisplayUserData>
                    </Grid>
                    }>	
                </MenuAppBar>
            );
        }
    }
}
export default withStyles(useStyles, { withTheme: true })(SoldierInfo);