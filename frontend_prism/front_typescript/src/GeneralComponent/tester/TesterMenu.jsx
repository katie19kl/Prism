import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SchoolIcon from '@material-ui/icons/School';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';


function TesterMenu() {

    return (

        <List>

            <Link to="general_staff" style={{ textDecoration: 'none', color:"black" }}> 
                <ListItem button key="General">
                    <ListItemIcon>
                        <AccountBalanceIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="General"/>
                </ListItem>
            </Link>


            <Link to="/admin/course_files" style={{ textDecoration: 'none', color:"black" }}>
                <ListItem button key="files">
                    <ListItemIcon>
                        <SchoolIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Course Files"/>
                </ListItem>
            </Link>

            <Link to="/admin/course_status" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button key="course status">
                <ListItemIcon>
                    <BlurOnRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Course Status"/>
            </ListItem>
            </Link>

            <Link to="/admin/info" style={{ textDecoration: 'none', color:"black" }}> 

                <ListItem button key="settings">
                    <ListItemIcon>
                        <SettingsRoundedIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Edit profile"/>
                </ListItem>
            </Link>

        </List>
    );
}

export default TesterMenu;