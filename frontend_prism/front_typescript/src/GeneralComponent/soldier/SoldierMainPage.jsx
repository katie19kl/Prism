import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../main/MenuAppBar';
import SoldierMenu from './SoldierMenu'
import Role from "../../Roles/Role";


export default class SoldierMainPage extends React.Component {

	render() {

		return (
            <div>
            <CssBaseline />
            <MenuAppBar

                role = {Role.Soldier}

                menu={
                    <SoldierMenu />
                } />
        </div>
		);
	}
}

