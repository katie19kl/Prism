import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from './Components/MenuAppBar';
import CommanderMenu from "./Components/CommanderMenu";


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

