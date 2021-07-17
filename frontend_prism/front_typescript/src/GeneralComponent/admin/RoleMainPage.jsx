import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../main/MenuAppBar';
import CommanderMenu from "./CommanderMenu";
import LocalStorage from "../../HelperJS/LocalStorage";


export default class RoleMainPage extends React.Component {

	render() {

		return (
			<div>
				<CssBaseline />
				<MenuAppBar
					role = {LocalStorage.getItem('currentRole')}
					menu={
						<CommanderMenu />
					} />
			</div>
		);
	}
}

