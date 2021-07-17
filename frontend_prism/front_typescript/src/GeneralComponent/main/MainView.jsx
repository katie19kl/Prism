import React from "react";
import { currentUserRole, currentUserUsername } from "../../HelperJS/authentification_helper.js"
import NoPermissions from "../../HelperFooStuff/NoPermissions";
import Role from '../../Roles/Role';
import GeneralSoldier from "../soldier/GeneralSoldier.jsx";
import General from "../../GeneralComponent/admin/GeneralStaff"


export default class MainPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			getCurrentUserName: currentUserUsername,
			getCurrentRole: currentUserRole,
			username: undefined,
			role: undefined
		};
	}

	componentDidMount() {
		let currUsername = this.state.getCurrentUserName();
		let currRole = this.state.getCurrentRole();

		this.setState({
			username: currUsername,
			role: currRole
		})
	}
  

	render() {
		const { role } = this.state;

		if ((role === Role.Admin) || (role === Role.Commander)) {
		
			return <General />;
		
		} else if (role === Role.Soldier) {
		
			return <GeneralSoldier/>

		} else if (role === Role.Tester) {
			
			return <General />

		} else {
			return <NoPermissions />;
		}

	}
}
	