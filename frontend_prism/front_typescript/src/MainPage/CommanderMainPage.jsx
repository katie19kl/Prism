import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from './Components/MenuAppBar';


export default class CommanderMainPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div>
			  <CssBaseline />
			  <MenuAppBar />
			</div>
		);
	}
}

