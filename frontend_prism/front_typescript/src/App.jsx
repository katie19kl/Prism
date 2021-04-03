import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogINComp from './Login/LogINComp' 
import CommanderMainPage from './GeneralComponent/admin/CommanderMainPage';
import NoPermissions from './HelperFooStuff/NoPermissions';
import PrivateRoutingComponent from './Routing/PrivateRoutingComponent'
import MainView from './GeneralComponent/main/MainView'
import Role from './Roles/Role';
import UsersHandling from './adminOperationSideBar/UserCreation/UsersHandling';
import CreateUser from './adminOperationSideBar/UserCreation/CreateUser';
import UpdateUsers from './adminOperationSideBar/UserCreation/UpdateUsers';

import ChangeAdminSettings from './adminOperationSideBar/AdminInfoManipulation/ChangeAdminSettings'

import AdminSettings from './adminOperationSideBar/AdminInfoManipulation/AdminSettings'

export default function App() {
	return (
	  <Router>
		<div>
		   {/*<nav>
			<ul>
			  <li>
				<Link to="/login">Login</Link>
			  </li>
			  <li>
				<Link to="/mainPage">MainPage</Link>
			  </li>
				<li>
				<Link to="/about">About</Link>
			  </li>				
			  <li>
				<Link to="/adminPage">Admin Page</Link>
			  </li>
			</ul>
		   </nav>*/}
  
		  <Switch>
				
				<PrivateRoutingComponent path="/mainPage" component={MainView} />

				<PrivateRoutingComponent path="/adminPage" roles={[Role.Admin]} component={CommanderMainPage}>
				</PrivateRoutingComponent>
			
			<Route path="/login" component={LogINComp}>
			</Route>

			{/* /////////////////////////////////////////CHANGE AFTER TO PRIVATE */}
			<Route path="/admin/info" component={AdminSettings}>
			</Route>

			<Route path="/admin/info_change" component={ChangeAdminSettings}>
			</Route>


			<Route path="/about" component={About}>
			</Route>

			<Route path="/admin/users" component={UsersHandling} />

			<Route path="/admin/create_user" component={CreateUser} />

			<Route path="/admin/update_user" component={UpdateUsers} />


			<Route path="/noPermissions" component={NoPermissions}>
			</Route>

			<PrivateRoutingComponent path="/" component={MainView}/>
			</Switch>
		</div>
	  </Router>
	);
}


function About() {
	
	return <h2> About Page </h2>;
}
