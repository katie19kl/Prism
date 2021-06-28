import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuAppBar from '../main/MenuAppBar';
import Role from "../../Roles/Role";
import TesterMenu from "./TesterMenu";


export default class TesterMainPage extends React.Component {

	render() {

		return (
			<div>
				<CssBaseline />
				<MenuAppBar
					role={Role.Tester}
					menu={
						<TesterMenu />
					} />
			</div>
		);
	}
}
