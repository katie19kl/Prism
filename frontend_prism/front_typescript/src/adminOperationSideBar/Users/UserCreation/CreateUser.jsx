import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import UserCreationForm from "./UserCreationForm";
import Role from "../../../Roles/Role";
import { getUserInfoByJWT } from "../../../HelperJS/extract_info";
import WaiterLoading from "../../../HelperComponentStuff/WaiterLoading";


const useStyles = (theme) => ({
    padding: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(3),
        fontFamily: 'monospace',
    },
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
            updated: false,
            myRole: undefined
        }
    }

    handleChange(event) {

        this.setState({
            viewForm: true,
            value: event.target.value
        }, () => this.getForm(this.state.value));
        
    }

    getForm(role) {

        const { history } = this.props;

        switch (role) {
            case "commander":
                this.form = <UserCreationForm 
                myRole={
                    role
                }
                history={history} />
                break;

            case "tester":
                this.form = <UserCreationForm 
                myRole={
                    role
                }
                history={history} />
                break;

            case "soldier":           
                this.form = <UserCreationForm
                myRole={
                    role
                }
                history={history}/>
                break;

            default:
                this.form = null;
        }

        // Cause re-rendering.
        this.setState({ updated: true})
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                user = user.data;
                let role = user["role"];

                this.setState({ myRole: role });
            }
        });
    }


    render() {

        const { classes } = this.props;

        if (this.state.myRole === undefined) {
            return <WaiterLoading />;
        
        } else {
            return (
                <MenuAppBar
                role ={this.state.myRole}
                menu={
                    <CommanderMenu />
                }
                content={
                    <div>
                        <Grid container item justify='center' alignItems='center'>
    
                            <Grid container item justify='center' alignItems='center'>
                                <Typography variant="h5" className={classes.padding}>
                                    <b>I would like to create a user with the following role: </b>
                                </Typography>
                            </Grid>
                            
                            <Grid container item justify='center' alignItems='center'>
                                <FormControl component="fieldset">
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
                            </Grid>
    
                            <Grid container item justify='center' alignItems='center'>
                                <div id="form-based-on-roles">
                                    {
                                    // if view - true -> render this.form o.w. -> render ''
                                    (this.state.viewForm) ? this.form : ''
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                }>
                </MenuAppBar>
            );
        }
        
    }
}

export default withStyles(useStyles, { withTheme: true })(CreateUser);