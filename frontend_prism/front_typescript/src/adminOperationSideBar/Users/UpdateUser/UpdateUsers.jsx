import React from "react";
import { withStyles } from '@material-ui/core/styles';
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import { TextField, Grid } from "@material-ui/core";
//import DisplayUserData from "../../../HelperFooStuff/DisplayUserData";
import {getUserInfoByJWT, getUserInfoById, getSoldiersByMajors} from "../../../HelperJS/extract_info"
import ChangeUserData from "../../../HelperFooStuff/ChangeUserData";
import Role from "../../../Roles/Role";


const useStyles = (theme) => ({
    myFont: {
        //fontFamily: "Comic Sans MS, Comic Sans, cursive",
        fontFamily: 'monospace'
    },
    select: {
        width: "45ch"
    },
});


class UpdateUsers extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeSelectSoldier = this.handleChangeSelectSoldier.bind(this);
        this.setUpdatedFieldsOfSoldier = this.setUpdatedFieldsOfSoldier.bind(this);
        this.soldier_id = undefined;
        this.form = undefined;
        this.soldierInCommanderMajor = [
            {
                firstName: ' None',
                lastName: ' ',
                personalId: ' ' 
            }
 
        ];

        this.state = { 
            _selected: false,
            _error: false,
            _users_retrieved: false,

            soldier_firstName: undefined,
            soldier_secondName: undefined,
            soldier_phone: undefined,
            soldier_username: undefined,
            commander: undefined,

        };
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

        //const { classes } = this.props;
        this.soldier_id = event.target.value;
        
        // make default values to cause re-rendering when user was selected
        this.setState({_selected: false, _error: false});

        getUserInfoById(this.soldier_id).then((user) => {

            // none was chosen
            if (user === undefined) {
                this.form = <h2> problem with user loading </h2>
                this.setState({_error: true})
            }
            // user doesnt exist
            else if (user.data === "") {
                this.form = <h2> problem with user loading </h2>
                this.setState({_error: true});

            } else {
                let data = user.data;
                let phone_num = data.phoneNumber;
                let userName = data.username;
                let firstName = data.firstName;
                let lastName = data.lastName;
                let commander = data.commander;
                //let role = data.role;
                //let gender = data.gender;
                //let major = data.major;

                /*this.soldier_phone = phone_num;
                this.soldier_username = userName;
                this.soldier_firstName = firstName;
                this.soldier_secondName = lastName;
                this.commander = commander;
                */

                this.setState({
                    soldier_firstName: firstName,
                    soldier_secondName: lastName,
                    soldier_phone: phone_num,
                    soldier_username: userName,
                    commander: commander,
                    _selected: true
                });

                //this.setState({_selected: true});

                
                /*this.form = <DisplayUserData title={
                    <Grid justify='center' alignItems='center' container item xs={12}>
                        <h4 className={classes.myFont}><b> Current Info </b></h4>
                    </Grid>
                }
                major = {major} 
                gender = {gender}
                role = {role}
                lastName = {lastName}
                firstName = {firstName}
                username = {userName}
                phone_number = {phone_num}
                personalId = {this.soldier_id}
                ></DisplayUserData>
                */
            }
        }, (error) => {

            this.form = <h2>problem with user loading </h2>
            this.setState({error: true})
        });
    }

    setUpdatedFieldsOfSoldier(data) {
        let username = data.username;
        let firstName = data.firstName;
        let lastName = data.lastName;
        let phoneNumber = data.phoneNumber;
        let commander = data.commander;

        // set the fields which are not-updated(=undefined) to the ones existing in the state obj.
        if (username === undefined || username === "") {
            username = this.state.soldier_username;
        }

        if (firstName === undefined || firstName === "") {
            firstName = this.state.soldier_firstName
        }

        if (lastName === undefined || lastName === "") {
            lastName = this.state.soldier_secondName;
        }

        if (phoneNumber === undefined || phoneNumber === "") {
            phoneNumber = this.state.soldier_phone;
        }

        if (commander === undefined || commander === "") {
            commander = this.state.commander;
        }

        this.setState({
            soldier_firstName: firstName,
            soldier_secondName: lastName,
            soldier_phone: phoneNumber,
            soldier_username: username,
            commander: commander,
        });

	}

    render() {
        const { classes } = this.props;
            
        if (this.state._users_retrieved) {
            return (
                <MenuAppBar
                role={Role.Commander} 
                menu={
                    <CommanderMenu />
                }
                content={
                    <div>
                        
                        <Grid container justify='center' alignItems='center'>

                            <br/>
                            <br/>
                            <br/>
                            <br/>

                            <Grid container item justify='center' alignItems='center'>
                                <h4 className={classes.myFont}><b> Choose which one you want to update </b></h4>                          
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
                                toChangeByUserName={this.state.soldier_username}
                                prev_phone_number={this.state.soldier_phone}
                                prev_lastName = {this.state.soldier_secondName}
                                prev_firstName = {this.state.soldier_firstName}
                                prev_username = {this.state.soldier_username}
                                prev_commander = {this.state.commander}
                                setUpdatedFieldsOfSoldier={this.setUpdatedFieldsOfSoldier}>
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