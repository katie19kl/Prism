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
import AssignmentIcon from '@material-ui/icons/Assignment';



function SoldierMenu() {

    return(
        <div>

<           Link to='/soldier_tasks' style={{ textDecoration: 'none', color:"black" }}> 
                <ListItem button key="Tasks">
                    <ListItemIcon>
                        <AssignmentIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Tasks"                          
                    />
                </ListItem>
            </Link>




            <ListItem button key="posts">
                <ListItemIcon>
                    <LocalPostOfficeRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Posts"/>
            </ListItem>


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


/*

            <DisplayUserData
							
							phone_number = {this.state.phone_number} 
							role = {this.state.role}
							lastName = {this.state.lastName}
							firstName = {this.state.firstName}
							gender = {this.state.gender}
							major = {this.state.major}
							username = {this.state.username}
							>

						</DisplayUserData>
*/