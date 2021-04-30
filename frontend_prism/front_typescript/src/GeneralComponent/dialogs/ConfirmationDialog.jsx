import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from "@material-ui/core";


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


class ConfirmationDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseConfirm = this.props.handleCloseConfirm;
        this.handleCloseCancel = this.props.handleCloseCancel;
        this.handleClose = this.props.handleCloseCancel;
        this.dialogGoal = this.props.dialogGoal;

        this.state = {
            open: this.props.confirmDialogOpen
        };
    }

    componentDidUpdate() {
        if (this.props.confirmDialogOpen !== this.state.open) {

            this.setState({ open: this.props.confirmDialogOpen });

        }
    }

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle 
                id="alert-dialog-title">
                    {this.dialogGoal}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to perform this action?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleCloseCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleCloseConfirm} color="primary" autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(ConfirmationDialog);