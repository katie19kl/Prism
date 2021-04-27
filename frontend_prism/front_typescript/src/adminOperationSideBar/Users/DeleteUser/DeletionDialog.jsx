import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle,
        Button, InputLabel, NativeSelect, FormControl, Grid,
        Snackbar } from "@material-ui/core";
import { getUserInfoByJWT, getSoldiersByMajors } from "../../../HelperJS/extract_info"
import ConfirmationDialog from "./ConfirmationDialog";
import { deleteUserByPersonalId } from './delete_user';
import MuiAlert from '@material-ui/lab/Alert';



const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
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
        this.msg = undefined;
        this.severity = undefined;

        this.defaultChoice = {
            firstName: 'None',
            lastName: ' ',
            personalId: ' ' 
        };

        this.soldierInCommanderMajors = [
            {
                firstName: 'None',
                lastName: ' ',
                personalId: ' ' 
            },
        ];

        this.state = {
            open: this.props.open,
            chosenSoldier: undefined,
            usersRetrieved: false,
            confirmDialogOpen: false,
            showMsg: false,
            msgOpen: false,
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

                            let line = {
                                firstName: firstNameUser,
                                lastName: lastNameUser,
                                personalId: personalIdUser 
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
        this.getSoldiersList();
    }

    componentDidUpdate() {

        if (this.props.open !== this.state.open) {

            this.setState({ open: this.props.open });

        }
    }

    handleUserChange(event) {
        console.log(event.target.value);

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

    handleMsgClose() {
        this.setState({ msgOpen: false });
    }

    handleCloseConfirm() {
        // delete the user

        deleteUserByPersonalId(this.state.chosenSoldier).then((response) => {
            if (response !== undefined) {
                if (response.status === 200) {

                    // deletion was done successfully- refresh the page.
                    //window.location.reload(false);

                    this.msg = "User deleted successfully";
                    this.severity = "success";

                    // update the select now that the user is deleted.
                    this.soldierInCommanderMajors = [this.defaultChoice];
                    this.getSoldiersList();
                    
                    // cause re-rendering.
                    this.setState({ 
                        msgOpen: true,
                        showMsg: true
                    });
                }

            } else {
                console.log(response);

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

    render() {
        
        if (this.state.usersRetrieved) {

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
                        <DialogContent style={{height:'120px'}}>
                        
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
                                + sld.firstName + " " + sld.lastName
                                }
                                </option>
                            ))}

                            </NativeSelect>
                        </FormControl>
                        </Grid>
                            
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                Cancel
                            </Button>

                            { (this.state.chosenSoldier !== undefined) 
                            ? <ConfirmationDialog 
                            confirmDialogOpen={this.state.confirmDialogOpen}
                            handleCloseConfirm={this.handleCloseConfirm}
                            handleCloseCancel={this.handleCloseCancel}
                            /> : '' }
                        </DialogActions>
                    </Dialog>

                    {(this.state.showMsg === true) ? <Snackbar open={this.state.msgOpen} 
                        autoHideDuration={3000}
                        onClose={this.handleMsgClose}>
                            <Alert onClose={this.handleMsgClose} severity={this.severity}>
                            {this.msg}
                            </Alert>
                        </Snackbar> : '' }

                </Grid>
            );
        } else {
            return null;
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(DeletionDialog);