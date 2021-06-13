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


class InsertionDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseInsert = this.props.handleCloseInsert;
        this.handleCloseCancelInsertion = this.props.handleCloseCancelInsertion;
        this.handleClose = this.props.handleCloseCancel;
        this.dialogGoal = this.props.dialogGoal;
        this.labelName = this.props.labelName;
        this.onChange = this.props.insertionOnChange;

        this.state = {
            open: this.props.insertDialogOpen
        };
    }

    componentDidUpdate() {
        if (this.props.insertDialogOpen !== this.state.open) {

            this.setState({ open: this.props.insertDialogOpen });

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
                        To create a new one please enter its name:
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
                <Button onClick={this.handleCloseCancelInsertion} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleCloseInsert} color="primary" autoFocus>
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(InsertionDialog);