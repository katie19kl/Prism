import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SchoolIcon from '@material-ui/icons/School';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import AdjustRoundedIcon from '@material-ui/icons/AdjustRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import LocalPostOfficeRoundedIcon from '@material-ui/icons/LocalPostOfficeRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';


function CommanderMenu() {

    return(
        <List>
            <ListItem button key="General">
                <ListItemIcon>
                    <AccountBalanceIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="General"/>
            </ListItem>

            <ListItem button key="files">
                <ListItemIcon>
                    <SchoolIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Course Files"/>
            </ListItem>

            <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem button key="user Settings">
                    <ListItemIcon>
                        <GroupRoundedIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Users"/>
                </ListItem>
            </Link>

            <ListItem button key="course status">
                <ListItemIcon>
                    <BlurOnRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Course Status"/>
            </ListItem>

            <ListItem button key="soldier status">
                <ListItemIcon>
                    <AdjustRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Soldier Status"/>
            </ListItem>

            <ListItem button key="posts">
                <ListItemIcon>
                    <LocalPostOfficeRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Posts"/>
            </ListItem>

            <Link to="/admin/edit_profile" style={{ textDecoration: 'none', color:"black" }}> 

                <ListItem button key="settings">
                    <ListItemIcon>
                        <SettingsRoundedIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Edit profile"                          
                    />
                </ListItem>
            </Link>
        </List>
    );
}

export default CommanderMenu;