import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { isNumeric } from '../../HelperJS/validator';
import Role from "../../Roles/Role";
import { Dialog, DialogActions, DialogContent, DialogTitle, 
    Button, DialogContentText, Input, TextField, FormControl, FormLabel,
    RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, FormHelperText,
    Grid} from "@material-ui/core";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing(3),
    },
    radio: {
        marginTop: theme.spacing(3),
    }
});


class ReviewCreationDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseCreate = this.props.handleCloseCreate;
        this.handleCloseCancel = this.props.handleCloseCancel;
        this.handleClose = this.props.handleCloseCancel;
        this.onChange = this.props.commentOnChange;
        this.gradeOnChange = this.props.gradeOnChange;
        this.gradeValidator = this.gradeValidator.bind(this);
        this.handleChangeGradeDesc = this.props.handleChangeGradeDesc;
        this.handleShowTo = this.handleShowTo.bind(this);
        this.handleOnCreate = this.handleOnCreate.bind(this);
        this.parentHandleShowTo = this.props.setShowTo;

        this.state = {
            open: this.props.reviewDialogOpen,
            gradeErr: "",
            soldier: false,
            commander: false,
            tester: false,
        };
    }

    componentDidUpdate() {

        if (this.props.reviewDialogOpen !== this.state.open) {
            this.setState({ open: this.props.reviewDialogOpen });

        }
    }

    gradeValidator(event) {
        let val = event.target.value;

        if (val === '') {
            this.gradeOnChange(val);
            this.setState({ gradeErr: '' });

        } else if (!isNumeric(val)) {
            this.setState({ gradeErr: 'You must enter a number in the range [0-100]' });

        } else {

            if (Number(val) < 0 || Number(val) > 100) {
                this.setState({ gradeErr: 'You must enter a number in the range [0-100]' });

            } else {
                this.gradeOnChange(val);
                this.setState({ gradeErr: '' });
            }
        }
    }

    handleShowTo(event) {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
    }

    handleOnCreate() {
        let showToArr = [];

        if (this.state.commander === true) {
            showToArr.push(Role.Commander);
        }

        if (this.state.soldier === true) {
            showToArr.push(Role.Soldier);
        }

        if (this.state.tester === true) {
            showToArr.push(Role.Tester);
        }

        this.parentHandleShowTo(showToArr);
        this.handleCloseCreate();
    }

    render() {
        const { classes } = this.props;
        let buttonEnable = false;

        // at least one role was chosen, grade description is chosen and comment was entered.
        if ((this.state.soldier !== false || this.state.commander !== false 
            || this.state.tester !== false) && (this.props.reviewComment !== '') 
            && (this.props.gradeDesc !== undefined)) {  

            if (this.state.gradeErr === '') {

                buttonEnable = true;
            }
        }

        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm">
                <DialogTitle 
                id="alert-dialog-title">
                    Review Creation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Your Review
                    </DialogContentText>
                    <DialogContentText>
                        (You may enter more than one line)
                    </DialogContentText>

                    <TextField
                    id="grade"
                    variant="outlined"
                    label="Grade"
                    size='small'
                    error={this.state.gradeErr.length === 0 ? false : true}
                    helperText={this.state.gradeErr}
                    onChange={this.gradeValidator}
                    /> 

                    <br/>

                    <Grid container item xs={12}>

                        <Grid container item xs={6}>
                            <FormControl component="fieldset" className={classes.formControl} required>
                                <FormLabel component="legend">Show The Review To:</FormLabel>
                                <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={this.state.soldier} 
                                        onChange={this.handleShowTo} 
                                        name="soldier" />
                                    }
                                    label="Soldier" />
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={this.state.commander} 
                                        onChange={this.handleShowTo} 
                                        name="commander" />
                                    }
                                    label="Commander" />
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={this.state.tester} 
                                        onChange={this.handleShowTo} 
                                        name="tester" />
                                    }
                                    label="Tester" />
                                </FormGroup>
                                <FormHelperText>You can choose more than one</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item container xs={6} className={classes.radio}>
                            <FormControl component="fieldset" required>
                                <FormLabel component="legend">Grade Description</FormLabel>
                                <RadioGroup 
                                aria-label="grade-description" 
                                name="grade" 
                                value={this.state.gradeDesc} 
                                onChange={this.handleChangeGradeDesc}>
                                    <FormControlLabel value="OK" control={<Radio />} label="Ok" />
                                    <FormControlLabel value="NOT_OK" control={<Radio />} label="Not Ok" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <Input
                    required
                    placeholder="Review"
                    inputProps={{ 'aria-label': 'review' }}
                    multiline
                    rowsMax='10'
                    fullWidth
                    onChange={this.onChange} />

                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleCloseCancel} color="primary" variant='contained' >
                    Cancel
                </Button>
                <Button 
                onClick={this.handleOnCreate} 
                color="primary" 
                autoFocus 
                variant='contained' 
                disabled={!buttonEnable}>
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(ReviewCreationDialog);