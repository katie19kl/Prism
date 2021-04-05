import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";

import UserCreationForm from "./UserCreationForm";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginTop: theme.spacing(5),
        marginLeft: theme.spacing(20),
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 

    },
    radio: {
        flexGrow: 1,
        /*position: 'absolute', 
        left: '50%', 
        top: '43%',
        transform: 'translate(-50%, -50%)',
        */
    },
    role: {
        flexGrow: 1,
        marginTop: theme.spacing(5),
        marginLeft: theme.spacing(35),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 
    }
});


class CreateUser extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.getForm = this.getForm.bind(this);
        this.form = null;

        this.state = {
            value: 'undefined',
            viewForm: false,
            updated: false
        }
    }

    
    handleChange(event) {

        this.setState({
            viewForm: true,
            value: event.target.value
        }, () => this.getForm(this.state.value));
        
    }


    getForm(role) {

        console.log("in get form");

        switch (role) {
            case "commander":
                this.form = <UserCreationForm 
                myRole={
                    role
                }/>
                break;

            case "tester":
                this.form = <UserCreationForm 
                myRole={
                    role
                }/>
                break;

            case "soldier":           
                this.form = <UserCreationForm
                myRole={
                    role
                }
                />
                break

            default:
                this.form = null;
        }

        // Cause re-rendering.
        this.setState({ updated: true})
    }


    render() {

        const { classes } = this.props;
        
        console.log("in render")

        return (
            <MenuAppBar
            menu={
                <CommanderMenu />
            }
            content={
                <div>
                    <Typography variant="h5" className={classes.padding}>
                        I would like to create a user with the following role:
                    </Typography>

                    <FormControl component="fieldset" className={classes.role}>
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup
                        row
                        aria-label="role"
                        name="role1"
                        value={this.state.value}
                        onChange={this.handleChange}>
                            <FormControlLabel value="commander" control={<Radio />} label="Commander" />
                            <FormControlLabel value="tester" control={<Radio />} label="Tester" />
                            <FormControlLabel value="soldier" control={<Radio />} label="Soldier" />
                        </RadioGroup>
                    </FormControl>
                    <div id="form-based-on-roles">
                        {
                        // if view - true -> render this.form o.w. -> render ''
                        (this.state.viewForm) ? this.form : ''
                        }
                    </div>
                </div>
            }>
            </MenuAppBar>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(CreateUser);