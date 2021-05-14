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
import ChangeAdminSettings from './adminOperationSideBar/AdminInfoManipulation/ChangeAdminSettings';
import AdminSettings from './adminOperationSideBar/AdminInfoManipulation/AdminSettings';
import CourseFilesMainView from './adminOperationSideBar/CourseFiles/CourseFilesMainView';
import SoldierInfo from './soldierOperationSideBar/soldierProfile/SoldierInfo'
import SoldierTasks from './soldierOperationSideBar/soldierTasks/SoldierTasks';
import DisplayContentOfModule from './soldierOperationSideBar/soldierTasks/DisplayContentOfModule';
import UploadBar from './adminOperationSideBar/Courses/CourseUploading/UploadBar';
import UserSubmission from "./soldierOperationSideBar/soldierSubmission/UserSubmission"


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

			<Route path="/admin/course_files" component={CourseFilesMainView} />

			
			<Route path="/admin/file_uploading/:major/:module/:subject" component={UploadBar} />

			<Route path="/admin/users" component={UsersHandling} />

			<Route path="/admin/create_user" component={CreateUser} />

			<Route path="/admin/update_user" component={UpdateUsers} />

			<Route path="/noPermissions" component={NoPermissions}>
			</Route>

			<Route path="/soldier_info" component={SoldierInfo}>
			</Route>

			
			<Route path="/soldier_tasks" component={SoldierTasks}>
			</Route>


			<Route path="/module_content/:moduleName/:major" component={DisplayContentOfModule}>
			</Route>


			<Route path="/submission/info/:moduleName/:major/:subject" component={UserSubmission}></Route>
			

			<PrivateRoutingComponent path="/" component={MainView}/>
			</Switch>
		</div>
	  </Router>
	);
}


function About() {
	
	return <h2> About Page </h2>;
}
