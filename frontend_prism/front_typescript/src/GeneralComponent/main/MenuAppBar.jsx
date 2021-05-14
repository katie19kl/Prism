import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import { currentUserUsername } from '../../HelperJS/authentification_helper';
import Button from '@material-ui/core/Button';

import LocalStorage from "../../HelperJS/LocalStorage"
import { Link } from 'react-router-dom';
import prism from './../../Images/prism.jpg'


const drawerWidth = 240;


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    text: {
        marginLeft: 10,
    },
    name: {
        alignItems: "center",
        marginLeft: 105,
        marginTop: -10,
    },
    toolbar: theme.mixins.toolbar,
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
});


class MenuAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.getUserName = currentUserUsername;

        this.state = {
            open: true,
            username: undefined
        };
    }

    componentDidMount() {

        let currUsername = this.getUserName();

        
        console.log("main app setting state with  " + currUsername + " to " + this.state.username)
        this.setState({
            username: currUsername
        })
    }

    handleDrawerOpen() {
        this.setState({
            open: true
        })
    };
    
    handleDrawerClose() {
        this.setState({
            open: false
        })
    };

    render() {

        console.log("main app bar")

        const { classes, theme } = this.props;
        const { username } = this.state;

        let role = this.props.role;

        
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: this.state.open,})}>
                    <Toolbar>
                    <IconButton 
                    edge="start" 
                    className={clsx(classes.menuButton, this.state.open && classes.hide)}
                    color="inherit"
                    aria-label="menu"
                    onClick={this.handleDrawerOpen}>
                    <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Prism Dashboard
                    </Typography>

                    <Link to="/login" 
                            style={{ textDecoration: 'none', color:"white" }}
                            onClick={()=> LocalStorage.cleanAll()}>
                        <Button color="inherit" >Log out </Button>
                    </Link>
                    
                    </Toolbar>
                </AppBar>
                
                <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={this.state.open}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <List>
                    <ListItem key="greeting">
                        <Avatar alt={username} className={classes.purple}/>
                        <ListItemText primary= {"Hello " + role} className={classes.text}>
                        </ListItemText>
                    </ListItem>
                    <h6 className={classes.name}> <b>{username}</b> </h6>
                </List>

                <Divider />
                    <div>
                    {this.props.menu}
                    </div>
                <Divider />

                <img alt="" src={prism} height="350" width="231"></img>

                </Drawer>

                {/* Separation from the app bar. */}                
                <div className={classes.toolbar} />

                <div className={clsx(classes.appBar, {[classes.appBarShift]: this.state.open,})} id="toInsert">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(MenuAppBar)