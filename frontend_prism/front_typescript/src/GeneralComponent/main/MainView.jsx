import React from "react";
import { currentUserRole, currentUserUsername } from "../../HelperJS/authentification_helper.js"
import CommanderMainPage from "../admin/CommanderMainPage.jsx";
import NoPermessions from "../../HelperFooStuff/NoPermissions";
import Role from '../../Roles/Role';


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
		const { username, role } = this.state;

		if ((role === Role.Admin) || (role === Role.Commander)) {
		
			return <CommanderMainPage/>;
		
		} else if (role === Role.Soldier) {
			

		} else if (role === Role.Tester) {


		} else {
			// return an error to the UI.
			return <NoPermessions/>;
		}
		return (
			<div>
                <h1>Main page view Component</h1>
                <p>Your role is: <strong>{role}</strong>.</p>
                <p>This page can be accessed by all authenticated users.</p>
                <div>
                    Current user from secure api end point:
                    { username }
                </div>
            </div>
		);
	}
}
	