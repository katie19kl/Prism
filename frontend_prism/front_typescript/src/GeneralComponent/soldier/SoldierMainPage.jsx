import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../main/MenuAppBar';
import SoldierMenu from './SoldierMenu'


export default class SoldierMainPage extends React.Component {

	render() {

		return (
            <div>
            <CssBaseline />
            <MenuAppBar

                role = "Soldier"

                menu={
                    <SoldierMenu />
                } />
        </div>
		);
	}
}

