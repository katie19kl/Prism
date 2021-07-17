import { Button, Typography, Grid } from "@material-ui/core";
import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import { withStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Link } from "react-router-dom";
import DeletionDialog from "./DeleteUser/DeletionDialog";
import Role from "../../Roles/Role";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";


const useStyles = (theme) => ({
    button: {
        marginTop: theme.spacing(5),
    },
});

class UsersHandling extends React.Component {

    constructor(props) {
        super(props);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            open: false,
            myRole: undefined
        }
    }

    handleClickOpen() {
        this.setState({ open: true });
    };
    
    handleClose() {
        this.setState({ open: false });
    };

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
                role={this.state.myRole}
                menu={
                    <CommanderMenu />
                }
                content={
                    <Grid container item justify='center' alignItems='center' xs={12}>
    
                        <Grid container item justify='center' alignItems='center'>
                            
                            <Grid container item justify='center' alignItems='center'>
                                <Typography variant="h6" className={classes.button}>
                                    To create a user, please press below
                                </Typography>
                            </Grid>
    
                            <Link to="/admin/create_user" 
                            style={{ textDecoration: 'none', color: 'inherit' }}>
    
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PersonAddIcon />}
                                    className={classes.button}>
                                    Create User 
                                </Button>
    
                            </Link>
                        </Grid>
    
                        <Grid container item justify='center' alignItems='center'>
    
                            <Grid container item justify='center' alignItems='center'>
                                <Typography variant="h6" className={classes.button}>
                                    To edit an existing user, please press below
                                </Typography>
                            </Grid>

                            {this.state.myRole === Role.Commander ?
                            <Link to="/commander/update_user" 
                            style={{ textDecoration: 'none', color: 'inherit' }}>
    
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    className={classes.button}>
                                    Update User
                                </Button>
                            
                            </Link>
                            : ''}

                            {this.state.myRole === Role.Admin ?
                            <Link to="/admin/update_user" 
                            style={{ textDecoration: 'none', color: 'inherit' }}>
    
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    className={classes.button}>
                                    Update User
                                </Button>
                            
                            </Link>
                            : ''}

                        </Grid>
    
                        <Grid container item justify='center' alignItems='center'>
    
                            <Grid container item justify='center' alignItems='center'>
                                <Typography variant="h6" className={classes.button}>
                                    To delete an existing user, please press below
                                </Typography>
                            </Grid>
    
                            <Button 
                                variant="contained"
                                color="primary"
                                startIcon={<DeleteForeverIcon />}
                                onClick={this.handleClickOpen}
                                className={classes.button}>
                                Delete User
                            </Button>
    
                        </Grid>
    
                        <DeletionDialog 
                        open={this.state.open}
                        handleClose={this.handleClose}
                        handleClickOpen={this.handleClickOpen}
                        />
    
                    </Grid>
                }/>
            );
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(UsersHandling);