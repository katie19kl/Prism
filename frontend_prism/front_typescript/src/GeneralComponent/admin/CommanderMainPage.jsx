import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../main/MenuAppBar';
import CommanderMenu from "./CommanderMenu";


export default class CommanderMainPage extends React.Component {

	render() {

		return (
			<div>
				<CssBaseline />
				<MenuAppBar
					menu={
						<CommanderMenu />
					} />
			</div>
		);
	}
}

