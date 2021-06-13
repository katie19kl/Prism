import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText, TextField } from "@material-ui/core";


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


class RenameDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseEdit = this.props.handleCloseEdit;
        this.handleCloseCancelEdit = this.props.handleCloseCancelEdit;
        this.handleClose = this.props.handleCloseCancel;
        this.dialogGoal = this.props.dialogGoal;
        this.labelName = this.props.labelName;
        this.onChange = this.props.editOnChange;

        this.state = {
            open: this.props.RenameDialogOpen
        };
    }

    componentDidUpdate() {
        if (this.props.RenameDialogOpen !== this.state.open) {

            this.setState({ open: this.props.RenameDialogOpen });

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
                    <DialogContentText>
                        Enter the new name:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={this.labelName}
                        fullWidth
                        onChange={this.onChange}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleCloseCancelEdit} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleCloseEdit} color="primary" autoFocus>
                    Rename
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(RenameDialog);