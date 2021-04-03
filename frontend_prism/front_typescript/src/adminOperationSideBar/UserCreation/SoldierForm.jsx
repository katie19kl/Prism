import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';


const Gender = {
    Male: "male",
    Female: "female" 
};

const genders = [
    {
      value: Gender.Male,
      label: 'Male',
    },
    {
      value: Gender.Female,
      label: 'Female',
    },
];

const Major = {
    Software: "software",
    Reserach: "research",
    Firmware: "firmware",
    Validation: "validation"
};

const majors = [
    {
        value: Major.Software,
        label: 'Software',
      },
      {
        value: Major.Reserach,
        label: 'Research',
      },
      {
        value: Major.Firmware,
        label: 'Firmware',
      },
      {
        value: Major.Validation,
        label: 'Validation',
      },
];

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
});

class SoldierForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangeMajor = this.handleChangeMajor.bind(this);

        this.state = {
            gender: Gender.Male,
            major: Major.Software
        };
    }

    handleChangeGender(event) {
        this.setState({
            gender: event.target.value
        });
    }

    handleChangeMajor(event) {
        this.setState({
            major: event.target.value
        })
    }
    
    render() {
        const { classes } = this.props;

        return (
            <div>
                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <TextField
                        required
                        id="outlined-basic-personal-id"
                        variant="outlined"
                        label="Required"
                        defaultValue="Personal ID"
                        />

                        <TextField
                        required
                        id="outlined-basic-username"
                        variant="outlined"
                        label="Required"
                        defaultValue="Username"
                        />

                        <TextField
                        required
                        id="outlined-basic-pwd"
                        variant="outlined"
                        label="Required"
                        defaultValue="Password"
                        />

                        <br/>
                        <br/>

                        <TextField
                        required
                        id="outlined-basic-first-name"
                        variant="outlined"
                        label="Required"
                        defaultValue="First Name"
                        />

                        <TextField
                        required
                        id="outlined-basic-last-name"
                        variant="outlined"
                        label="Required"
                        defaultValue="Last Name"
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
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                        </TextField>

                        <br/>
                        <br/>

                        <TextField
                        id="outlined-basic-phone-number"
                        variant="outlined"
                        defaultValue="Phone Number"
                        />

                        <TextField
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
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                        </TextField>
                        
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </form>

                <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                className={classes.button}
                >
                Save
                </Button>

                <br/>
                <br/>

            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(SoldierForm);