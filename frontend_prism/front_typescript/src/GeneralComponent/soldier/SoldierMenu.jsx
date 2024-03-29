import ListItemIcon from '@material-ui/core/ListItemIcon';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';


function SoldierMenu() {

    return(
        <div>

            <Link to="/general_soldier" style={{ textDecoration: 'none', color:"black" }}> 
                <ListItem button key="General">
                    <ListItemIcon>
                        <AccountBalanceIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="General"/>
                </ListItem>
            </Link>

            <Link to='/soldier_tasks' style={{ textDecoration: 'none', color:"black" }}> 
                <ListItem button key="Tasks">
                    <ListItemIcon>
                        <AssignmentIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Tasks"                          
                    />
                </ListItem>
            </Link>

            <Link to='/soldier_info' style={{ textDecoration: 'none', color:"black" }}> 
                <ListItem button key="settings">
                    <ListItemIcon>
                        <SettingsRoundedIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="My profile"                          
                    />
                </ListItem>
            </Link>
            


        </div>
    );
}

export default SoldierMenu;