import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Checkbox, FormControl, FormControlLabel, Grid,
         FormGroup, FormHelperText, FormLabel, Snackbar, TextField } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { Gender, genders } from '../../../HelperJS/Gender';
import { Major, majors } from "../../../HelperJS/Major";
import Role from "../../../Roles/Role";
import { sendCreateUserRequest } from "../../../HelperJS/request_handler";
import MuiAlert from '@material-ui/lab/Alert';
import { 
    handleOptionalFields, 
    isNumeric, 
    onlyLettersAndDigits, 
    checkPassword,
    isValidName 
} from '../../../HelperJS/validator';


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        marginTop: theme.spacing(3),
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
    button: {
        marginLeft: theme.spacing(3),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        marginLeft: theme.spacing(42),
    }
});

/* shows the alert msg when creation attempt is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class UserCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangePersonalId = this.handleChangePersonalId.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeLastName = this.handleChangeLastName.bind(this);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangePhoneNumber = this.handleChangePhoneNumber.bind(this);
        this.handleChangeMajor = this.handleChangeMajor.bind(this);
        this.handleChangeCommanderMajor = this.handleChangeCommanderMajor.bind(this);
        this.handleChangeCommander = this.handleChangeCommander.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);

        this.personalId = '';
        this.username = '';
        this.password = '';
        this.firstName = '';
        this.lastName = '';
        this.gender = Gender.Undefined;
        this.phoneNumber = '';
        this.major = Major.Undefined;
        this.commander = '';
        this.showWarning = false;
        this.msg = undefined;
        this.severity = undefined;


        this.state = {
            msgOpen: false,
            role: this.props.myRole,
            updated: false,
            
            software: false,
            research: false,
            firmware: false,
            validation: false,

            personalIdErr: "",
            usernameErr: "",
            passwordErr: "",
            firstNameErr: "",
            lastNameErr: "",
            genderErr: "",
            phoneNumberErr: "",
            majorErr: "",
            commanderErr: "",
            majorCommanderErr: ""
        }
    }

    handleChangePersonalId(event) {
        
        let val = event.target.value;
        this.personalId = val;

        if (val.length === 0) {
            this.setState({ personalIdErr: "You must enter the personal ID"});

        } else if (!isNumeric(val)) {
            this.setState({ personalIdErr: "Personal ID must contain only numbers"});
        
        } else {
            this.personalId = val;
            this.setState({ personalIdErr: "" });
        } 
    }

    handleChangeUsername(event) {

        let val = event.target.value;
        this.username = val;

        if (val.length === 0) {
            this.setState({ usernameErr: "You must enter the username"});

        } else if (!onlyLettersAndDigits(val)) {
            this.setState({ usernameErr: "Username must contain only numbers and digits"});
        
        } else {
            this.username = val;
            this.setState({ usernameErr: "" });
        } 
    }

    handleChangePassword(event) {

        let val = event.target.value;
        this.password = val;

        if (val.length === 0) {
            this.setState({ passwordErr: "You must enter the password"});

        } else if (!checkPassword(val)) {
            this.setState({ 
                passwordErr: "Should have: one Uppercase letter, " +
                    "one lowercase, one digit, length in range 6-20"
            });
        
        } else {
            this.password = val;
            this.setState({ passwordErr: "" });
        } 
    }

    handleChangeFirstName(event) {

        let val = event.target.value;
        this.firstName = val;

        if (val.length === 0) {
            this.setState({ firstNameErr: "You must enter the first name"});

        } else if (!isValidName(val)) {
            this.setState({ 
                firstNameErr: "First name must contain letters only"
            });
        
        } else {
            this.firstName = val;
            this.setState({ firstNameErr: "" });
        } 
    }

    handleChangeLastName(event) {

        let val = event.target.value;
        this.lastName = val;

        if (val.length === 0) {
            this.setState({ lastNameErr: "You must enter the last name"});

        } else if (!isValidName(val)) {
            this.setState({ 
                lastNameErr: "Last name must contain letters only"
            });
        
        } else {
            this.lastName = val;
            this.setState({ lastNameErr: "" });
        }
    }

    handleChangeGender(event) {

        this.gender = event.target.value;
        
        if (this.gender === 'None') {
            this.setState({ genderErr: "You must choose a gender" });
        } else {
            this.setState({ genderErr: "" });
        }
    }
    
    handleChangePhoneNumber(event) {

        let val = event.target.value;
        this.phoneNumber = val;

        if (val.length > 0 && val.length < 10) {
            this.setState({ phoneNumberErr: "The phone number is not valid" });

        } else if (val.length === 10) {

            if (!isNumeric(val)) {
                this.setState({ phoneNumberErr: "The phone number is not valid" });

            } else {
                this.phoneNumber = val;
                this.setState({ phoneNumberErr: "" });

            }
        } else if (val.length === 0) {
            this.phoneNumber = undefined;
            this.setState({ phoneNumberErr: ""});
        }
    }

    handleChangeMajor(event) {
        this.major = event.target.value

        this.setState({ updated: true });
    }

    handleChangeCommanderMajor(event) {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
    }

    handleChangeCommander(event) {

        let val = event.target.value;
        this.commander = val;

        if (val.length === 0) {
            this.commander = undefined;
            this.setState({ commanderErr: ""});

        } else if (!isNumeric(val)) {
            this.setState({ commanderErr: "Personal ID of commander must contain only numbers"});
        
        } else {
            this.commander = val;
            this.setState({ commanderErr: "" });
        } 
    }

    componentDidUpdate() {
        
        if (this.props.myRole !== this.state.role) {
            this.setState({
                role: this.props.myRole
            });
        }
    }

    handleSave() {
        let data = {
            personalId: this.personalId,
            username: this.username,
            password: this.password,
            role: this.props.myRole,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
        };

        let role = this.props.myRole;

        let optionals = {
            phoneNumber: this.phoneNumber,
            major: [this.major],
            listMajors: {
                "software" : this.state.software,
                "research": this.state.research,
                "firmware": this.state.firmware,
                "validation": this.state.validation,
            },
            commander: this.commander
        };

        let optionalFields = handleOptionalFields(optionals, role);

        // Add optional fields if they are defined.
        for (var key in optionalFields) {
            data[key] = optionalFields[key];
        }

        sendCreateUserRequest(data).then((res) => {

            this.handleResponse(res);

        }, (err) => {
;
            this.handleResponse(err);
            
        })
    }

    handleResponse(res) {

        if (res.response !== undefined) {

            if ((res.response.status === 400) || (res.response.status === 403)) {
            
                this.showWarning = true;
                this.severity = "error";
                
                if (res.response.data.message !== undefined) {

                    this.msg = res.response.data.message;
                } else {

                    this.msg = "Invalid input, please fix";
                }
    
                this.setState({ updated: true, msgOpen: true });
    
            } else {
                this.showWarning = true;
                this.severity = "error"
                this.msg = "Something went wrong! Please try again";
                this.setState({ updated: true, msgOpen: true });
            }

        } else {
            if (res.status === 201) {

                this.personalId = "";
                this.username = "";
                this.password = "";
                this.firstName = "";
                this.lastName = "";
                this.gender = "";
                this.phoneNumber = "";
                this.major = Major.Undefined;
                this.commander = "";

                this.showWarning = true;
                this.severity = "success"
                this.msg = "Created Successfully!";
                this.setState({ 
                    updated: true, msgOpen: true, software: false, research: false, 
                    firmware: false, validation: false
                });
     
            }
        }
    }

    handleMsgClose() {
        this.showWarning = false;
        this.setState({ msgOpen: false });
    }
    
    render() {
        const { classes } = this.props;
        const { software, research, firmware, validation } = this.state;
        let history = this.props.history;
        let buttonEnable = false;


        if (this.personalId !== undefined && this.username !== undefined && this.password !== undefined
            && this.firstName !== undefined && this.lastName !== undefined && this.gender !== 'None'
            && this.gender !== Gender.Undefined && (this.major !== Major.Undefined 
            || (this.state.software !== false || this.state.research !== false 
            || this.state.firmware !== false || this.state.validation !== false))) {  

            if (this.state.personalIdErr === "" && this.state.usernameErr === ""
                && this.state.passwordErr === "" && this.state.firstNameErr === ""
                && this.state.lastNameErr === "" && this.state.genderErr === ""
                && this.state.majorErr === "" && this.state.phoneNumberErr === ""
                && this.state.commanderErr === "") {

                buttonEnable = true;
            }
        }
        
        return (
            <div>
                {(this.showWarning) 
                ? <Snackbar open={this.state.msgOpen} 
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={this.handleMsgClose}>
                    <Alert onClose={this.handleMsgClose} severity={this.severity}>
                        {this.msg}
                    </Alert>
                </Snackbar> : ""}

                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <TextField
                        required
                        id="outlined-basic-personal-id"
                        variant="outlined"
                        label="Required - Personal ID"
                        value={this.personalId}
                        error={this.state.personalIdErr.length === 0 ? false : true}
                        helperText={this.state.personalIdErr}
                        onChange={this.handleChangePersonalId}
                        />

                        <TextField
                        required
                        id="outlined-basic-username"
                        variant="outlined"
                        label="Required - Username"
                        value={this.username}
                        error={this.state.usernameErr.length === 0 ? false : true}
                        helperText={this.state.usernameErr}
                        onChange={this.handleChangeUsername}
                        />

                        <TextField
                        required
                        id="outlined-basic-pwd"
                        variant="outlined"
                        label="Required - Password"
                        value={this.password}
                        type="password"
                        error={this.state.passwordErr.length === 0 ? false : true}
                        helperText={this.state.passwordErr}
                        onChange={this.handleChangePassword}
                        />

                        <br/>
                        <br/>

                        <TextField
                        required
                        id="outlined-basic-first-name"
                        variant="outlined"
                        label="Required - First Name"
                        value={this.firstName}
                        error={this.state.firstNameErr.length === 0 ? false : true}
                        helperText={this.state.firstNameErr}
                        onChange={this.handleChangeFirstName} />

                        <TextField
                        required
                        id="outlined-basic-last-name"
                        variant="outlined"
                        label="Required - Last Name"
                        value={this.lastName}
                        error={this.state.lastNameErr.length === 0 ? false : true}
                        helperText={this.state.lastNameErr}
                        onChange={this.handleChangeLastName} />

                        <TextField
                        id="outlined-select-gender"
                        select
                        required
                        label="Required - Gender"
                        error={this.state.genderErr.length === 0 ? false : true}
                        helperText={this.state.genderErr}
                        value={this.gender}
                        onChange={this.handleChangeGender}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        >
                        {genders.map((option) => (
                            <option 
                            key={Math.random().toString(36).substr(2, 9)} 
                            value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        </TextField>

                        <br/>
                        <br/>

                        <TextField
                        id="outlined-basic-phone-number"
                        variant="outlined"
                        label="Phone Number"
                        value={this.phoneNumber}
                        error={this.state.phoneNumberErr.length === 0 ? false : true}
                        helperText={this.state.phoneNumberErr}
                        onChange={this.handleChangePhoneNumber} />

                        {(this.props.myRole === Role.Commander || this.props.myRole === Role.Tester) 
                        ? <FormControl component="fieldset" className={classes.formControl} required>
                            <FormLabel component="legend"> Choose Your Majors </FormLabel>
                            <FormGroup style={{display: 'flex', flexDirection: 'row'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        checked={software}
                                        onChange={this.handleChangeCommanderMajor} 
                                        name="software" />
                                    }
                                    label="Software"
                                />
                                <FormControlLabel
                                    control={
                                    <Checkbox 
                                    checked={research} 
                                    onChange={this.handleChangeCommanderMajor} 
                                    name="research" />
                                }
                                    label="Research"
                                />
                                <FormControlLabel
                                    control={<Checkbox 
                                        checked={firmware} 
                                        onChange={this.handleChangeCommanderMajor} 
                                        name="firmware" />
                                    }
                                    label="Firmware"
                                />
                                <FormControlLabel
                                    control={
                                    <Checkbox 
                                        checked={validation} 
                                        onChange={this.handleChangeCommanderMajor} 
                                        name="validation" />
                                    }
                                    label="Validation"
                                />
                            </FormGroup>
                            <FormHelperText>You may choose more than one</FormHelperText>
                        </FormControl> : ''
                        }

                        {(this.props.myRole === Role.Soldier) ? <TextField
                            required
                            id="outlined-select-major"
                            select
                            label="Major"
                            value={this.major}
                            error={this.state.majorErr.length === 0 ? false : true}
                            helperText={this.state.majorErr}
                            onChange={this.handleChangeMajor}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            >
                            {majors.map((option) => (
                                <option 
                                key={Math.random().toString(36).substr(2, 9)} 
                                value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                            </TextField> : ''
                        }

                        {(this.props.myRole === Role.Soldier) ? <TextField
                        id="outlined-basic-commander"
                        variant="outlined"
                        label="Commander ID"
                        value={this.commander}
                        error={this.state.commanderErr.length === 0 ? false : true}
                        helperText={this.state.commanderErr}
                        onChange={this.handleChangeCommander}
                        /> : ''}

                        <br />
                        <br />

                    </div>
                </form>
                
                <Grid item container justify='center' alignItems='center'>

                    <Button
                    variant='contained'
                    color="primary"
                    size="large"
                    style={{backgroundColor: "red"}}
                    onClick={() => history.goBack()}>
                        <b>GO BACK</b>
                    </Button>

                    <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!buttonEnable}
                    startIcon={<SaveIcon />}
                    onClick={this.handleSave}>
                        <b>Save</b>
                    </Button>

                </Grid>

                <br/>
                <br/>

            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(UserCreationForm);