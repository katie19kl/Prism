import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogINComp from './Component/LogINComp' 
import CommanderMainPage from './MainPage/CommanderMainPage';
import NoPermissions from './MainPage/NoPermissions';
import PrivateRoutingComponent from './Routing/PrivateRoutingComponent'
import MainView from './Component/MainView'
import Role from './Roles/Role';
import AdminSettings from './MainPage/SideBarComponentsAdmin/AdminSettings'

import ChangeAdminSettings from './MainPage/SideBarComponentsAdmin/ChangeAdminSettings'

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
