import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { TextField, Typography } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { Gender, genders } from '../../../HelperJS/Gender';
import { Major, majors } from "../../../HelperJS/Major";
import Role from "../../../Roles/Role";
import { validateFields, handleOptionalFields } from '../../../HelperJS/validator';
import { sendCreateUserRequest } from "../../../HelperJS/request_handler";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(15),
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
    button: {
        marginLeft: theme.spacing(51),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        marginLeft: theme.spacing(42),
    }
});


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
        this.handleChangeCommander = this.handleChangeCommander.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleResponse = this.handleResponse.bind(this);

        this.personalId = undefined;
        this.username = undefined;
        this.password = undefined;
        this.firstName = undefined;
        this.lastName = undefined;
        this.gender = Gender.Undefined;
        this.phoneNumber = undefined;
        this.major = Major.Undefined;
        this.commander = undefined;
        this.showWarning = false;
        this.msg = undefined;


        this.state = {
            role: this.props.myRole,
            updated: false,
            //creationMsg: undefined
        }

    }

    handleChangePersonalId(event) {
        this.personalId = event.target.value
    }

    handleChangeUsername(event) {
        this.username = event.target.value
    }

    handleChangePassword(event) {
        this.password = event.target.value
    }

    handleChangeFirstName(event) {
        this.firstName = event.target.value
    }

    handleChangeLastName(event) {
        this.lastName = event.target.value
    }

    handleChangeGender(event) {
        this.gender = event.target.value
    }
    
    handleChangePhoneNumber(event) {
        this.phoneNumber = event.target.value
    }

    handleChangeMajor(event) {
        this.major = event.target.value
    }

    handleChangeCommander(event) {
        this.commander = event.target.value
    }

    componentDidUpdate() {
        
        console.log("in did update: " + this.props.myRole);
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

        let optionals = {
            phoneNumber: this.phoneNumber,
            major: this.major,
            commander: this.commander
        };

        let result = validateFields(data);
        let optionalFields = handleOptionalFields(optionals);

        if (result.length > 0) {

            this.showWarning = true;
            this.msg = "You have missing fields!"

            // cause re-rendering.
            this.setState({updated: true});
            
            return;
        }

        // Add optional fields if they are defined.
        for (var key in optionalFields) {
            data[key] = optionalFields[key];
        }

        console.log(data);

        sendCreateUserRequest(data).then((res) => {
            console.log(res);
            this.handleResponse(res);


        }, (err) => {
            console.log(err);

            this.handleResponse(err);
            
        })
    }

    handleResponse(res) {

        if (res.response !== undefined) {

            if ((res.response.status === 400) || (res.response.status === 403)) {
            
                this.showWarning = true;
                this.msg = "Invalid input, please fix";
    
                this.setState({ updated: true });
    
            } else {
                this.showWarning = true;
                this.msg = "Something went wrong!";
                this.setState({ updated: true});
            }

        } else {
            if (res.status === 201) {

                console.log("successful creation, should reload");
                
                window.location.reload(false);

                this.showWarning = true;
                this.msg = "Created Successfully!";
                this.setState({ updated: true});
     
            }
        }
    }
    
    render() {
        const { classes } = this.props;
        
        console.log("role: " + this.state.role);

        return (
            <div>
                {(this.showWarning) ? <Typography 
                            variant="h6"
                            className={classes.myFont}
                            color="error">
                            {this.msg}
                            </Typography> : ""}

                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <TextField
                        required
                        id="outlined-basic-personal-id"
                        variant="outlined"
                        label="Required - Personal ID"
                        onChange={this.handleChangePersonalId}
                        />

                        <TextField
                        required
                        id="outlined-basic-username"
                        variant="outlined"
                        label="Required - Username"
                        onChange={this.handleChangeUsername}
                        />

                        <TextField
                        required
                        id="outlined-basic-pwd"
                        variant="outlined"
                        label="Required - Password"
                        onChange={this.handleChangePassword}
                        />

                        <br/>
                        <br/>

                        <TextField
                        required
                        id="outlined-basic-first-name"
                        variant="outlined"
                        label="Required - First Name"
                        onChange={this.handleChangeFirstName}
                        />

                        <TextField
                        required
                        id="outlined-basic-last-name"
                        variant="outlined"
                        label="Required - Last Name"
                        onChange={this.handleChangeLastName}
                        />

                        <TextField
                        id="outlined-select-gender"
                        select
                        required
                        label="Required - Gender"
                        value={this.state.gender}
                        onChange={this.handleChangeGender}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        >
                        {genders.map((option) => (
                            <option key={Math.random().toString(36).substr(2, 9)} value={option.value}>
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
                        onChange={this.handleChangePhoneNumber}
                        />

                        {(this.props.myRole !== Role.Tester) ? <TextField
                            id="outlined-select-major"
                            select
                            label="Major"
                            value={this.state.major}
                            onChange={this.handleChangeMajor}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            >
                            {majors.map((option) => (
                                <option key={Math.random().toString(36).substr(2, 9)} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                            </TextField> : ''}
                        
                        {(this.props.myRole === Role.Soldier) ? <TextField
                        id="outlined-basic-commander"
                        variant="outlined"
                        label="Commander ID"
                        onChange={this.handleChangeCommander}
                        /> : ''}

                        <br />
                        <br />

                    </div>
                </form>

                <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                className={classes.button}
                onClick={this.handleSave}
                >
                Save
                </Button>

                <br/>
                <br/>

            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(UserCreationForm);