import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogINComp from './Login/LogINComp' 
import CommanderMainPage from './GeneralComponent/admin/RoleMainPage';
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
import SubmissionStatus from './adminOperationSideBar/CourseStatus/SubmissionStatus';
import SoldierStatus from './adminOperationSideBar/SoldierStatus/SoldierStatus';
//import General from './GENERAL';
import UpdateUsersAdmin from './adminOperationSideBar/Users/UpdateUser/UpdateUsersAdmin';
import General from './GeneralComponent/admin/GeneralStaff';
import GeneralSoldier from './GeneralComponent/soldier/GeneralSoldier';



export default function App() {
	return (
	  <Router>
		<div>

		  <Switch>
				
			<PrivateRoutingComponent path="/mainPage" component={MainView} />

			<PrivateRoutingComponent path="/adminPage" roles={[Role.Admin, Role.Commander]} component={CommanderMainPage}>
			</PrivateRoutingComponent>
			

			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/123456789" component={General} />
			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/00000000000" component={General} />



			<PrivateRoutingComponent path="/general_staff" roles={[Role.Admin, Role.Commander]} component={General}/>

			<PrivateRoutingComponent path="/general_soldier" roles={[Role.Soldier]} component={GeneralSoldier}></PrivateRoutingComponent>


			<Route path="/login" component={LogINComp}>
			</Route>

			{/* /////////////////////////////////////////CHANGE AFTER TO PRIVATE */}
			<PrivateRoutingComponent path="/admin/info" roles={[Role.Admin, Role.Commander, Role.Tester]} component={AdminSettings}/>
			
			<PrivateRoutingComponent path="/admin/info_change" roles={[Role.Admin, Role.Commander, Role.Tester]} component={ChangeAdminSettings}/>
			
			<PrivateRoutingComponent path="/admin/course_files" roles={[Role.Admin, Role.Commander, Role.Tester]} component={CourseFilesMainView} />
			
			<PrivateRoutingComponent path="/file_uploading/:major/:module/:subject/:role" component={UploadBar} />

			<PrivateRoutingComponent path="/admin/users" roles={[Role.Admin, Role.Commander]} component={UsersHandling} />

			<PrivateRoutingComponent path="/admin/create_user" roles={[Role.Admin, Role.Commander]} component={CreateUser} />

			<PrivateRoutingComponent path="/commander/update_user" roles={[Role.Commander]} component={UpdateUsers} />

			<PrivateRoutingComponent path="/admin/update_user" roles={[Role.Admin]} component={UpdateUsersAdmin} />
			
			<PrivateRoutingComponent path="/admin/course_status" roles={[Role.Admin, Role.Commander, Role.Tester]} component={SubmissionStatus} />

			<PrivateRoutingComponent path="/admin/soldier/soldier_status" roles={[Role.Admin, Role.Commander]} component={SoldierStatus}/>
			
			<Route path="/noPermissions" component={NoPermissions}>
			</Route>

			<PrivateRoutingComponent path="/soldier_info" roles={[Role.Soldier]} component={SoldierInfo}/>

			<PrivateRoutingComponent path="/soldier_tasks" roles={[Role.Soldier]} component={SoldierTasks}/>
			
			<PrivateRoutingComponent path="/module_content/:moduleName/:major/:personalId" roles={[Role.Soldier]} component={DisplayContentOfModule}/>
			
			<PrivateRoutingComponent path="/submission/info/:major/:moduleName/:subject/:personalId" roles={[Role.Soldier]} component={UserSubmission}/>
			

			<PrivateRoutingComponent path="/admin/soldier_status/:personalId/:major/:module/:subject" role={[Role.Commander, Role.Tester, Role.Admin]}
			component={SubmissionStatusObject}/>
	
			<PrivateRoutingComponent path="/" component={MainView}/>
			
			
			
			</Switch>
		</div>
	  </Router>
	);
}


function About() {
	
	return <h2> About Page </h2>;
}


/*
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
import SubmissionStatus from './adminOperationSideBar/CourseStatus/SubmissionStatus';
import SoldierStatus from './adminOperationSideBar/SoldierStatus/SoldierStatus';
//import General from './GENERAL';
import UpdateUsersAdmin from './adminOperationSideBar/Users/UpdateUser/UpdateUsersAdmin';
import General from './GeneralComponent/admin/GeneralStaff';
import GeneralSoldier from './GeneralComponent/soldier/GeneralSoldier';



export default function App() {
	return (
	  <Router>
		<div>

		  <Switch>
				
			<PrivateRoutingComponent path="/mainPage" component={MainView} />

			<PrivateRoutingComponent path="/adminPage" roles={[Role.Admin]} component={CommanderMainPage}>
			</PrivateRoutingComponent>
			

			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/123456789" component={General} />
			<PrivateRoutingComponent path="/10- XUI/10.5- SUB XUI/00000000000" component={General} />



			<Route path="/general_staff" component={General}></Route>

			<Route path="/general_soldier" component={GeneralSoldier}></Route>


			<Route path="/login" component={LogINComp}>
			</Route>


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

			<Route path="/commander/update_user" component={UpdateUsers} />

			<Route path="/admin/update_user" component={UpdateUsersAdmin} />

			
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


			<Route path="/submission/info/:major/:moduleName/:subject/:personalId" component={UserSubmission}></Route>


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

*/