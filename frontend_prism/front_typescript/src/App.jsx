import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogINComp from './Login/LogINComp' 
import CommanderMainPage from './GeneralComponent/admin/RoleMainPage';
import NoPermissions from './HelperComponentStuff/NoPermissions';
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
			

			<PrivateRoutingComponent path="/general_staff" roles={[Role.Admin, Role.Commander, Role.Tester]} component={General}/>

			<PrivateRoutingComponent path="/general_soldier" roles={[Role.Soldier]} component={GeneralSoldier}></PrivateRoutingComponent>


			<Route path="/login" component={LogINComp}>
			</Route>
			
			<Route path="/noPermissions" component={NoPermissions} />

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
			
			<PrivateRoutingComponent path="/soldier_info" roles={[Role.Soldier]} component={SoldierInfo}/>

			<PrivateRoutingComponent path="/soldier_tasks" roles={[Role.Soldier]} component={SoldierTasks}/>
			
			<PrivateRoutingComponent path="/module_content/:moduleName/:major/:personalId" roles={[Role.Soldier]} component={DisplayContentOfModule}/>
			
			<PrivateRoutingComponent path="/submission/info/:major/:moduleName/:subject/:personalId"  component={UserSubmission}/>
			
			<PrivateRoutingComponent path="/admin/soldier_status/:personalId/:major/:module/:subject" role={[Role.Commander, Role.Tester, Role.Admin]}
			component={SubmissionStatusObject}/>
	
			<PrivateRoutingComponent path="/" component={MainView}/>
			
			</Switch>
		</div>
	  </Router>
	);
}
