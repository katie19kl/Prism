import { withStyles, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from "react"


const useStyles = (theme) => ({
    root2: {
        background: 'linear-gradient(45deg, #d1b3ff 30%, #6600ff 90%)',
        color: 'black',
    },
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '30ch',
        },
    },
});


class DisplayUserData extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' alignItems='center'>
                    {this.props.title}

                    <Grid container item justify='center' alignItems='center'>
                        <TextField
                            disabled id="user" 
                            variant="filled"
                            label="Username"
                            defaultValue= {this.props.username}>

                        </TextField>
                
                        <TextField
                            disabled id="pwd"
                            variant="filled"
                            label="Password" 
                            defaultValue="******" >

                        </TextField>
                    </Grid>

                    <dd></dd>
                    <br></br>
                
                    <Grid container item justify='center' alignItems='center'>
                        <TextField	
                            disabled id="major" 	
                            variant="filled"
                            label="Major"
                            defaultValue={this.props.major} >
                        </TextField>

                        
                        <TextField	
                            disabled id="gender" 	
                            variant="filled"
                            label="Gender"
                            defaultValue={this.props.gender} >
                        </TextField>
                    </Grid>

                    <dd></dd>
                    <br></br>

                    <Grid container item justify='center' alignItems='center'>
                        <TextField 
                            disabled id="first_name"
                            variant="filled"
                            label="First Name" 
                            defaultValue={this.props.firstName}>

                        </TextField>


                        <TextField 
                            disabled id="last_name"
                            variant="filled"
                            label="Last Name" 
                            defaultValue={this.props.lastName}>

                        </TextField>
                    </Grid>

                    <dd></dd>
                    <br></br>

                    <Grid container item justify='center' alignItems='center'>
                        <TextField	
                            disabled id="role" 	
                            variant="filled"
                            label="Role"
                            defaultValue={this.props.role} >
                        </TextField>

                        <TextField 
                            disabled id="phone" 
                            variant="filled"
                            label="Phone Number" 
                            defaultValue={this.props.phone_number}>

                        </TextField>
                    </Grid>


                    <Grid container item justify='center' alignItems='center'>
                        <TextField	
                            disabled id="personal_id" 	
                            variant="filled"
                            label="Personal ID"
                            defaultValue={this.props.personalId} >
                        </TextField>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(DisplayUserData);