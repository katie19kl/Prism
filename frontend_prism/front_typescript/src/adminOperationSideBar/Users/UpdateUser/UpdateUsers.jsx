import React from "react";
import { withStyles } from '@material-ui/core/styles';
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import { TextField, Grid } from "@material-ui/core";
import DisplayUserData from "../../../HelperFooStuff/DisplayUserData";
import {getUserInfoByJWT, getUserInfoById, getSoldiersByMajors} from "../../../HelperJS/extract_info"
import ChangeUserData from "../../../HelperFooStuff/ChangeUserData";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
    select: {
        width: "45ch"
    },
    padding: {
        marginRight: theme.spacing(10),
    }
});


class UpdateUsers extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeSelectSoldier = this.handleChangeSelectSoldier.bind(this);
        this.soldier_id = undefined;
        this.soldier_firstName = undefined;
        this.soldier_secondName = undefined;
        this.soldier_phone = undefined;
        this.soldier_username = undefined;
        this.state = { _selected: false, _error: false, _users_retrieved: false };
        this.form = undefined;
        this.soldierInCommanderMajor = [
            {
                firstName: ' None',
                lastName: ' ',
                personalId: ' ' 
            }
 
        ];
    }

    componentDidMount() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                user = user.data;
                let major = user["major"];

                getSoldiersByMajors(major).then((users) => {
                    if (users === undefined) {
                        this.setState({_users_retrieved: true});
                        
                    } else {

                        users = users.data;
                        for (user of users) {
                 
                            let personalIdUser = user.personalId;
                            let firstNameUser = user.firstName;
                            let lastNameUser = user.lastName;

                            let line = {
                                    firstName: firstNameUser,
                                    lastName: lastNameUser,
                                    personalId: personalIdUser 
                            }

                            this.soldierInCommanderMajor.push(line);
                        };
                    }
                    
                    this.soldierInCommanderMajor.sort((a,b) => a.personalId - b.personalId)
                    this.setState({_users_retrieved: true})
                });
            }
        });
    }

    // user selected => display its info 
    handleChangeSelectSoldier(event) {

        const { classes } = this.props;
        this.soldier_id = event.target.value;
        
        // make default values to cause re-rendering when user was selected
        this.setState({_selected: false, _error: false})

        getUserInfoById(this.soldier_id).then((user) => {

            // none was chosen
            if (user === undefined){
                this.form = <h2>problem with user loading </h2>
                this.setState({_error: true})
            }
            // user doesnt exist
            else if (user.data === ""){
                this.form = <h2>problem with user loading </h2>
                this.setState({_error: true});

            } else {
                let data = user.data;
                let phone_num = data.phoneNumber;
                let userName = data.username;
                let firstName = data.firstName;
                let lastName = data.lastName;
                let role = data.role;
                let gender = data.gender;
                let major = data.major;
                this.soldier_phone = phone_num;
                this.soldier_username = userName;
                this.soldier_firstName = firstName;
                this.soldier_secondName = lastName;
                
                
                this.form = <DisplayUserData title={
                    <Grid justify='center' alignItems='center' container item xs={12}>
                        <h4 className={classes.myFont}>Current Info</h4>
                    </Grid>
                }
                major = {major} 
                gender = {gender}
                role = {role}
                lastName = {lastName}
                firstName = {firstName}
                username = {userName}
                phone_number = {phone_num}
                >
                    
                </DisplayUserData>


                this.setState({_selected: true});
                }
        }, (error) => {

            this.form = <h2>problem with user loading </h2>
            this.setState({error: true})
        });
    }

    render() {
        const { classes } = this.props;
            
        if (this.state._users_retrieved) {
            return (
                <MenuAppBar
                role = "Commander" 
                menu={
                    <CommanderMenu/>
                }
                content={
                    <div className={classes.padding}>
                        
                        <Grid container justify='center' alignItems='center'>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <Grid container item justify='center' alignItems='center'>
                                <h4 className={classes.myFont}> Choose which one you want to update</h4>                          
                            </Grid>
                            <br></br>
                            <br></br>
                        
                            <Grid container item justify='center' alignItems='center'>
                                <TextField
                                select
                                label="Soldier info "
                                value={this.soldier_id}
                                className={classes.select}
                                onChange={this.handleChangeSelectSoldier}
                                SelectProps={{
                                    native: true,
                                }}
                                helperText="Please select soldier to update"
                                variant="outlined"
                                >
                                {this.soldierInCommanderMajor.map((sld) => (
                                        <option key={sld.personalId} value={sld.personalId}>
                                        {
                                        "Personal id: "  + sld.personalId + " | First name: " + sld.firstName 
                                        }
                                        </option>
                                ))}
                                </TextField>
                            </Grid>
                        </Grid>  
                    
                        <br/>
                        <br/>

                        <div id="form-based-on-selected user" style={{ display: 'inline-flex' }}>
                        {
                                // if view - true -> render this.form o.w. -> render ''
                                (this.state._selected) 
                                ?
                                <ChangeUserData 
                                soldier_id_ = {this.soldier_id}
                                toChangeByUserName={this.soldier_username}
                                prev_phone_number={this.soldier_phone}
                                prev_lastName = {this.soldier_secondName}
                                prev_firstName = {this.soldier_firstName}
                                prev_username = {this.soldier_username} >
                                </ChangeUserData>
                                
                                : ''
                                }
                                                {
                                // if view - true -> render this.form o.w. -> render ''
                                (this.state._error) 
                                ?
                                this.form
                                : ''
                                }

                                {
                                // if view - true -> render this.form o.w. -> render ''
                                (this.state._selected) 
                                ? this.form
                                
                                : ''
                                }
    
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                    
                }>

                </MenuAppBar>
            );
        }
        else {
            return (
                
                <MenuAppBar
                    role = "Commander" 
                    menu={
                        <CommanderMenu/>
                    }>
                        
                </MenuAppBar>
            );
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(UpdateUsers);