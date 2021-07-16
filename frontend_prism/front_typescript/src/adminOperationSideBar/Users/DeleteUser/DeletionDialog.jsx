import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle,
        Button, InputLabel, NativeSelect, FormControl, Grid,
        Snackbar, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { getUserInfoByJWT, getSoldiersByMajors, getAllUsersByRole } from "../../../HelperJS/extract_info"
import ConfirmationDialog from "../../../GeneralComponent/dialogs/ConfirmationDialog";
import { deleteUserByPersonalId } from './delete_user';
import MuiAlert from '@material-ui/lab/Alert';
import Role from "../../../Roles/Role";
import WaiterLoading from "../../../HelperFooStuff/WaiterLoading";


const useStyles = (theme) => ({

});


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class DeletionDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.props.handleClose;
        this.handleClickOpen = this.props.handleClickOpen;
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);
        this.getSoldiersList = this.getSoldiersList.bind(this);
        this.handleChangeRoleToDelete = this.handleChangeRoleToDelete.bind(this);
        this.handleUserChangeAdmin = this.handleUserChangeAdmin.bind(this);
        this.getUsersByRoleToDelete = this.getUsersByRoleToDelete.bind(this);

        this.msg = undefined;
        this.severity = undefined;
        this.listUsers = [];
        this.userId = undefined;
        this.firstElem = {
            firstName: ' ',
            lastName: ' ',
            personalId: ' ',
        }

        this.defaultChoice = {
            firstName: ' ',
            lastName: ' ',
            personalId: ' ',
            major: ' ' 
        };

        this.soldierInCommanderMajors = [
            {
                firstName: ' ',
                lastName: ' ',
                personalId: ' ',
                major: ' ' 
            },
        ];

        this.state = {
            open: this.props.open,
            chosenSoldier: undefined,
            chosenUser: undefined,
            usersRetrieved: false,
            confirmDialogOpen: false,
            showMsg: false,
            msgOpen: false,
            myRole: undefined,
            roleToDelete: '',
            _selected: false,
        };
    }

    getSoldiersList() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                user = user.data;
                let majors = user['major'];

                getSoldiersByMajors(majors).then((users) => {

                    if (users === undefined) {
                        this.setState({ usersRetrieved: true });
                        
                    } else {

                        users = users.data;
                        
                        for (var user of users) {

                            let personalIdUser = user.personalId;
                            let firstNameUser = user.firstName;
                            let lastNameUser = user.lastName;
                            let majorUser = user.major;

                            let line = {
                                firstName: firstNameUser,
                                lastName: lastNameUser,
                                personalId: personalIdUser,
                                major: majorUser
                            };

                            this.soldierInCommanderMajors.push(line);
                        }

                        this.soldierInCommanderMajors.sort((a,b) => a.personalId - b.personalId)
                        this.setState({ usersRetrieved: true });
                    }
                });
            }
        });
    }

    componentDidMount() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                user = user.data;
                let currRole = user["role"];

                if (currRole === Role.Commander) {
                    this.getSoldiersList();
                }

                this.setState({ myRole: currRole });   
            }
        });
    }

    componentDidUpdate() {

        if (this.props.open !== this.state.open) {

            this.setState({ open: this.props.open });

        }
    }

    handleUserChange(event) {

        let soldierId = event.target.value;

        // Chose a soldier(which is not 'None').
        if (soldierId !== ' ') {
            
            // Ask if the user is sure he wants to delete the soldier.
            this.setState({ 
                chosenSoldier: soldierId,
                confirmDialogOpen: true,
            });
        }
    }

    handleUserChangeAdmin(event) {
        let userId = event.target.value;

        // Chose a user(which is not 'None').
        if (userId !== ' ') {
            
            // Ask if the user is sure he wants to delete the chosen user.
            this.setState({
                chosenUser: userId,
                confirmDialogOpen: true,
            });
        }
    }

    handleMsgClose() {
        this.setState({ msgOpen: false, showMsg: false });
    }

    handleCloseConfirm() {

        let personalIdToDelete;

        if (this.state.myRole !== undefined && this.state.myRole === Role.Commander) {
            personalIdToDelete = this.state.chosenSoldier;

        } else if (this.state.myRole !== undefined && this.state.myRole === Role.Admin) {
            personalIdToDelete = this.state.chosenUser;
        }

        // delete the user
        deleteUserByPersonalId(personalIdToDelete).then((response) => {
            if (response !== undefined) {
                if (response.status === 200) {

                    // deletion was done successfully- refresh the page.
                    this.msg = "User deleted successfully";
                    this.severity = "success";

                    // update the select now that the user is deleted.
                    if (this.state.myRole === Role.Commander) {
                        this.soldierInCommanderMajors = [this.defaultChoice];
                        this.getSoldiersList();
                    
                    } else if(this.state.myRole === Role.Admin) {
                        this.listUsers = [this.firstElem];
                        this.getUsersByRoleToDelete(this.state.roleToDelete);
                    }
                    
                    // cause re-rendering.
                    this.setState({ 
                        msgOpen: true,
                        showMsg: true
                    });
                }

            } else {
    
                // show informative message to the screen.
                this.msg = "User deletion has failed";
                this.severity = "error";

                this.setState({
                    msgOpen: true,
                    showMsg: true
                });
            }

        });

        this.setState({ confirmDialogOpen: false });
    }

    handleCloseCancel() {

        // do nothing.
        this.setState({ confirmDialogOpen: false });
    }

    getUsersByRoleToDelete(chosenRole) {
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
                roleToDelete: chosenRole, 
            });
        });
    }

    handleChangeRoleToDelete(event) {
        let chosenRole = event.target.value;

        this.getUsersByRoleToDelete(chosenRole);
    }

    render() {
        
        if (this.state.myRole !== undefined) {

            return (
                <Grid container>
                    <Dialog
                    fullWidth={true}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle
                        id="alert-dialog-title">
                            {"Choose the user you would like to delete"}
                        </DialogTitle>
                        <DialogContent style={{height:'200px'}}>

                            {(this.state.myRole === Role.Admin) ? 
                            <Grid item>
                                <FormControl component="fieldset">
                                <FormLabel component="legend">Role</FormLabel>
                                <RadioGroup
                                row
                                aria-label="role"
                                name="role1"
                                value={this.state.roleToDelete}
                                onChange={this.handleChangeRoleToDelete}>
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
                            </Grid> : ''}


                            { // the logged-in user is a commander and the list of soldiers is received.
                            (this.state.myRole === Role.Commander && this.state.usersRetrieved) ?
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="user-native-helper">User</InputLabel>
                                    <NativeSelect
                                    value={undefined}
                                    onChange={this.handleUserChange}>

                                    {this.soldierInCommanderMajors.map((sld) => (
                                        <option key={sld.personalId} value={sld.personalId}>
                                        {
                                        "Personal ID: "  + sld.personalId + " | Full Name: " 
                                        + sld.firstName + " " + sld.lastName + " | Major: " + sld.major
                                        }
                                        </option>
                                    ))}

                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            : ''}

                            {(this.state.myRole === Role.Admin && this.state.roleToDelete !== '') ?
                            <Grid item>

                                <FormControl>
                                    <InputLabel htmlFor="user-helper">User</InputLabel>
                                    <NativeSelect
                                    value={undefined}
                                    onChange={this.handleUserChangeAdmin}>

                                    {this.listUsers.map((user) => (
                                        <option key={user.personalId} value={user.personalId}>
                                        {
                                        "Personal ID: "  + user.personalId + " | Full Name: " 
                                        + user.firstName + " " + user.lastName
                                        }
                                        </option>
                                    ))}

                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            : ''}
                            
                            
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                Cancel
                            </Button>

                            {((this.state.myRole === Role.Commander 
                            && this.state.chosenSoldier !== undefined) 
                            || (this.state.myRole === Role.Admin 
                            && this.state.chosenUser !== undefined)) ? 

                                <ConfirmationDialog 
                                confirmDialogOpen={this.state.confirmDialogOpen}
                                handleCloseConfirm={this.handleCloseConfirm}
                                handleCloseCancel={this.handleCloseCancel} />

                            : '' }
                        </DialogActions>
                    </Dialog>

                    {(this.state.showMsg === true) ? <Snackbar open={this.state.msgOpen} 
                        autoHideDuration={3000}
                        onClose={this.handleMsgClose}>
                            <Alert onClose={this.handleMsgClose} severity={this.severity}>
                            {this.msg}
                            </Alert>
                        </Snackbar> :
                    '' }

                </Grid>
            );
        } else {
            return <WaiterLoading />;
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(DeletionDialog);