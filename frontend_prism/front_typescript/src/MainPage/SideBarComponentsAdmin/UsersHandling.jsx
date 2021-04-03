import { Button, Typography } from "@material-ui/core";
import React from "react";
import CommanderMenu from "../Components/CommanderMenu";
import MenuAppBar from "../Components/MenuAppBar";
import { withStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from "react-router-dom";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
    padding2: {
        flexGrow: 1,
        marginLeft: theme.spacing(36),
        marginTop: theme.spacing(7),
    },
    button: {
        marginLeft: theme.spacing(50),
        marginTop: theme.spacing(2),

    },
});

class UsersHandling extends React.Component {

    render() {
        const { classes } = this.props;
        return(
            <MenuAppBar 
                menu={
                    <CommanderMenu />
                }
                content={
                    <div>
                        <Typography variant="h6" className={classes.padding}>
                            To create a user, please press below
                        </Typography>
                        <Link to="/admin/create_user" style={{ textDecoration: 'none', color: 'inherit' }}>

                            <Button 
                                variant="contained"
                                color="primary"
                                startIcon={<PersonAddIcon />}
                                className={classes.button}>
                                Create User 
                            </Button>

                        </Link>

                        <Typography variant="h6" className={classes.padding2}>
                            To edit an existing user, please press below
                        </Typography>

                        <Link to="/admin/update_user" style={{ textDecoration: 'none', color: 'inherit' }}>

                            <Button 
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                className={classes.button}>
                                Update User
                            </Button>
                        
                        </Link>

                        {/*<Switch>
                            <Route path={'/admin/users/update_user'}>
                            <UpdateUsers />
                            </Route>
                            <Route path={'/admin/users/create_user'}>
                            <CreateUser />
                            </Route>
                        </Switch>
                        */}

                    </div>
                }/>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(UsersHandling);