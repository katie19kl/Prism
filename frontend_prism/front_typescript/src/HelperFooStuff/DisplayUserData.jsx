import { withStyles, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from "react"


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '20ch',
        },
    },
    padding: {
        flexGrow: 1,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(10),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        marginLeft: theme.spacing(5),
        marginTop: theme.spacing(2),
    },
    select: {
        marginRight: theme.spacing(20),
    }
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
                    disabled id="standard-disabled_" 
                    variant="filled"
                    label="username" 
                    defaultValue= {this.props.username}>

                </TextField>
                
                <TextField
                    disabled id="standard-disabled=" 
                    variant="filled"
                    label="password" 
                    defaultValue="******" >

                </TextField>
                </Grid>

                <dd></dd>
                <br></br>
                
                <Grid container item justify='center' alignItems='center'>
                <TextField	
                    disabled id="standard-disabled!" 	
                    variant="filled"
                    label="majors"
                    defaultValue={this.props.major} >
                </TextField>

                
                <TextField	
                    disabled id="standard-disabled__" 	
                    variant="filled"
                    label="Gender"
                    defaultValue={this.props.gender} >
                </TextField>
                </Grid>

                <dd></dd>
                <br></br>

                <Grid container item justify='center' alignItems='center'>
                <TextField 
                    disabled id="standard-disabled=_"
                    variant="filled"
                    label="First Name" 
                    defaultValue={this.props.firstName}>

                </TextField>


                <TextField 
                    disabled id="standard-disabled=_="
                    variant="filled"
                    label="Last Name" 
                    defaultValue={this.props.lastName}>

                </TextField>
                </Grid>

                <dd></dd>
                <br></br>

                <Grid container item justify='center' alignItems='center'>
                <TextField	
                    disabled id="standard-disabled=_=_" 	
                    variant="filled"
                    label="Role"
                    defaultValue={this.props.role} >
                </TextField>

                <TextField 
                    disabled id="standard-disabled_=__" 
                    variant="filled"
                    label="Phone number" 
                    defaultValue={this.props.phone_number}>

                </TextField>
                </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(DisplayUserData);