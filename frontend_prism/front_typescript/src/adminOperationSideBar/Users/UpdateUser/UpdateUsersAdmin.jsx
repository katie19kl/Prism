import React from "react";
import { withStyles } from '@material-ui/core/styles';
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import { TextField, Grid, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import ChangeUserData from "../../../HelperComponentStuff/ChangeUserData";
import Role from "../../../Roles/Role";
import { getAllUsersByRole, getUserInfoByJWT } from '../../../HelperJS/extract_info'; 
import { getUserInfoById } 
        from "../../../HelperJS/extract_info";
import WaiterLoading from "../../../HelperComponentStuff/WaiterLoading";


const useStyles = (theme) => ({
    myFont: {
        fontFamily: 'monospace'
    },
    select: {
        width: "70ch"
    },
});


class UpdateUsersAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeRoleToUpdate = this.handleChangeRoleToUpdate.bind(this);
        this.handleChangeSelectUser = this.handleChangeSelectUser.bind(this);
        this.setUpdatedFieldsOfSoldier = this.setUpdatedFieldsOfSoldier.bind(this);

        this.userId = undefined;
        this.listUsers = [];
        this.firstElem = {
            firstName: ' ',
            lastName: ' ',
            personalId: ' ',
        }

        this.state = {
            roleToUpdate: '',
            _selected: false,

            userFirstName: undefined,
            userLastName: undefined,
            userPhone: undefined,
            userUsername: undefined,
            userCommander: undefined,

            myRole: undefined,
        };
    }

    handleChangeRoleToUpdate(event) {
        let chosenRole = event.target.value;
        let users;

        getAllUsersByRole(chosenRole).then((res) => {
            if (res !== undefined) {

                if (res.data !== undefined) {
                    users = res.data;

                } else {
                    users = [];
                }

            } else {
                users = [];
            }

            this.listUsers = [];
            this.listUsers.push(this.firstElem);

            if (users.length > 0) {

                for (const user of users) {

                    let obj = {
                        personalId: user.personalId,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
    
                    this.listUsers.push(obj);
                }
            }
            
            this.userId = this.firstElem.personalId;
            this.setState({
                _selected: false,
                roleToUpdate: chosenRole, 
                userFirstName: undefined,
                userUsername: undefined,
                userLastName: undefined,
                userPhone: undefined,
                userCommander: undefined,
            });
        });
    }

    handleChangeSelectUser(event) {

        this.userId = event.target.value;

        // check that a soldier was indeed chosen.
        if (this.userId !== undefined && this.userId !== '' && this.userId !== " ") {

            getUserInfoById(this.userId).then((user) => {

                // none was chosen
                if (user === undefined) {
                    this.setState({ _selected: false });
                }
                // user doesnt exist
                else if (user.data === "") {
                    this.setState({ _selected: false });
    
                } else {
                    let data = user.data;
                    let phone_num = data.phoneNumber;
                    let userName = data.username;
                    let firstName = data.firstName;
                    let lastName = data.lastName;
                    let commander = data.commander;
    
                    this.setState({
                        userFirstName: firstName,
                        userLastName: lastName,
                        userPhone: phone_num,
                        userUsername: userName,
                        userCommander: commander,
                        _selected: true
                    });
                }
            }, (error) => {
    
                // do nothing
            });
        } else {
            this.setState({ _selected: false });
        }
    }

    setUpdatedFieldsOfSoldier(data) {
        let username = data.username;
        let firstName = data.firstName;
        let lastName = data.lastName;
        let phoneNumber = data.phoneNumber;
        let commander = data.commander;

        // set the fields which are not-updated(=undefined)
        // to the ones existing in the state obj.
        if (username === undefined || username === "") {
            username = this.state.userUsername;
        }

        if (firstName === undefined || firstName === "") {
            firstName = this.state.userFirstName;
        }

        if (lastName === undefined || lastName === "") {
            lastName = this.state.userLastName;
        }

        if (phoneNumber === undefined || phoneNumber === "") {
            phoneNumber = this.state.userPhone;
        }

        if (commander === undefined || commander === "") {
            commander = this.state.userCommander;
        }

        // update the values in the select
        for (const user of this.listUsers) {
            if (user.personalId === this.userId) {
                user.firstName = firstName;
                user.lastName = lastName;
            }
        }

        this.setState({
            userFirstName: firstName,
            userLastName: lastName,
            userPhone: phoneNumber,
            userUsername: username,
            userCommander: commander,
        });
	}

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                user = user.data;
                let role = user["role"];

                this.setState({ myRole: role });
            }
        });
    }


    render() {
        const { classes } = this.props;
        const { history } = this.props;

        if (this.state.myRole === undefined) {
            return <WaiterLoading />;
        
        } else {

            return (
                <MenuAppBar
                role={this.state.myRole}
                menu={
                    <CommanderMenu />
                }
                content={
                    <div>
    
                        <Grid container justify='center' alignItems='center'>
    
                            <br />
                            <br />
                            <br />
    
                            <Grid container item justify='center' alignItems='center'>
                                <h4 className={classes.myFont}>
                                    <b> Choose which one you want to update </b>
                                </h4>                          
                            </Grid>
    
                            <br/>
    
                            <Grid item container justify='center' alignItems='center'>
    
                                <FormControl component="fieldset" className={classes.role}>
                                    <FormLabel component="legend">Role</FormLabel>
                                    <RadioGroup
                                    row
                                    aria-label="role"
                                    name="role1"
                                    value={this.state.roleToUpdate}
                                    onChange={this.handleChangeRoleToUpdate}>
                                        <FormControlLabel
                                        value={Role.Commander}
                                        control={<Radio />}
                                        label="Commanders" />
    
                                        <FormControlLabel 
                                        value={Role.Tester}
                                        control={<Radio />} 
                                        label="Testers" />
    
                                        <FormControlLabel 
                                        value={Role.Soldier} 
                                        control={<Radio />} 
                                        label="Soldiers" />
                                    </RadioGroup>
                                </FormControl>
    
                            </Grid>
    
                            {this.state.roleToUpdate !== '' ?
                                <Grid container item justify='center' alignItems='center'>
                                    <TextField
                                    select
                                    label="User Info"
                                    value={this.userId}
                                    className={classes.select}
                                    onChange={this.handleChangeSelectUser}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    helperText="Please select user to update"
                                    variant="outlined"
                                    >
                                    {this.listUsers.map((usr) => (
                                        <option key={usr.personalId} value={usr.personalId}>
                                        {
                                        "Personal ID: "  + usr.personalId + " | Full Name: " 
                                        + usr.firstName + " " + usr.lastName
                                        }
                                        </option>
                                    ))}
                                    </TextField>
                                </Grid>
                            : ''}
    
    
                            { // a user was selected
                            (this.state._selected && this.state.roleToUpdate === Role.Soldier) 
                            ?
                            <ChangeUserData 
                            soldier_id_={this.userId}
                            toChangeByUserName={this.state.userUsername}
                            prev_phone_number={this.state.userPhone}
                            prev_lastName={this.state.userLastName}
                            prev_firstName={this.state.userFirstName}
                            prev_username={this.state.userUsername}
                            prev_commander={this.state.userCommander}
                            setUpdatedFieldsOfSoldier={this.setUpdatedFieldsOfSoldier}
                            toCommander={false}
                            history={history}>
                            </ChangeUserData>
                            
                            : ''
                            }
    
                            { // a user was selected
                            (this.state._selected && (this.state.roleToUpdate === Role.Commander
                                || this.state.roleToUpdate === Role.Tester)) 
                            ?
                            <ChangeUserData 
                            soldier_id_={this.userId}
                            toChangeByUserName={this.state.userUsername}
                            prev_phone_number={this.state.userPhone}
                            prev_lastName={this.state.userLastName}
                            prev_firstName={this.state.userFirstName}
                            prev_username={this.state.userUsername}
                            prev_commander={this.state.userCommander}
                            setUpdatedFieldsOfSoldier={this.setUpdatedFieldsOfSoldier}
                            toCommander={true}
                            history={history}>
                            </ChangeUserData>
                            
                            : ''
                            }
    
                        </Grid>
                            
                    </div>
                }>
                </MenuAppBar>
            );
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(UpdateUsersAdmin);