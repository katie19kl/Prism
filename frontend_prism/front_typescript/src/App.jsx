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
import DisplayContentOfModule from './soldierOperationSideBar/soldierTasks/module/DisplayContentOfModule';
import UploadBar from './adminOperationSideBar/Courses/CourseUploading/UploadBar';
import UserSubmission from "./soldierOperationSideBar/soldierSubmission/UserSubmission"
import SubmissionStatusObject from './adminOperationSideBar/SubmissionStatusObject/SubmissionStatusObject';
import SoldierStatusKatie from './adminOperationSideBar/SoldierStatusKatie/SoldierStatus';
import SubmissionStatus from './adminOperationSideBar/CourseStatus/SubmissionStatus';
import SoldierStatus from './adminOperationSideBar/SoldierStatus/SoldierStatus';
import General from './GENERAL';


export default function App() {
	return (
	  <Router>
		<div>

		  <Switch>
				
			<PrivateRoutingComponent path="/mainPage" component={MainView} />

			<PrivateRoutingComponent path="/adminPage" roles={[Role.Admin]} component={CommanderMainPage}>
			</PrivateRoutingComponent>
			

			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/123456789" component={General} />

			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/987654321	" component={General} />



			<Route path="/general" component={General}>
			</Route>







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
			
			<Route path="/file_uploading/:major/:module/:subject/:role" component={UploadBar} />

			<Route path="/admin/users" component={UsersHandling} />

			<Route path="/admin/create_user" component={CreateUser} />

			<Route path="/admin/update_user" component={UpdateUsers} />
			
			<Route path="/admin/course_status" component={SubmissionStatus} />

			<Route path="/admin/soldier/soldier_status" component={SoldierStatus}/>
			
			<Route path="/noPermissions" component={NoPermissions}>
			</Route>

			<Route path="/soldier_info" component={SoldierInfo}>
			</Route>
			
			<Route path="/soldier_tasks" component={SoldierTasks}>
			</Route>

			<Route path="/module_content/:moduleName/:major/:personalId" component={DisplayContentOfModule}>
			</Route>

			{/*
			  * role: everyone which is logged in.
			  * Soldiers can see their user-submission object of a specific:
			  * major
			  * module
			  * subject
			  * personalId
			  * 
			  * Admin/Commanders/testers can check the submission of a soldier by choice.
			  */}
			<Route path="/submission/info/:major/:moduleName/:subject/:personalId" component={UserSubmission}></Route>


			{/*<Route path='/admin/table/soldier_status' component={SoldierStatusKatie}></Route> */}
			<Route 
			path="/admin/soldier_status/:personalId/:major/:module/:subject"
			component={SubmissionStatusObject}>
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
