import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogINComp from './Login/LogINComp' 
import CommanderMainPage from './GeneralComponent/admin/CommanderMainPage';
import NoPermissions from './HelperFooStuff/NoPermissions';
import PrivateRoutingComponent from './Routing/PrivateRoutingComponent'
import MainView from './GeneralComponent/main/MainView'
import Role from './Roles/Role';
import UsersHandling from './adminOperationSideBar/Users/UsersHandling';
import CreateUser from './adminOperationSideBar/Users/UserCreation/CreateUser';
import UpdateUsers from './adminOperationSideBar/Users/UpdateUser/UpdateUsers';
import DeleteUser from './adminOperationSideBar/Users/DeleteUser/DeleteUser'

import ChangeAdminSettings from './adminOperationSideBar/AdminInfoManipulation/ChangeAdminSettings'

import AdminSettings from './adminOperationSideBar/AdminInfoManipulation/AdminSettings'
import CourseUploading from './adminOperationSideBar/Courses/CourseUploading/CourseUploading' 






export default function App() {
	return (
	  <Router>
		<div>

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

			
			<Route path="/admin/delete_user" component={DeleteUser} />

			<Route path="/admin/upload_course_material" component={CourseUploading}/>



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
