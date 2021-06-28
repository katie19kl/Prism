import React from "react"
import CustomCalendar from "./GeneralComponent/commonGeneral/CustomCalendar"
import CustomClock from "./GeneralComponent/commonGeneral/CustomClock"
import CommanderMenu from "./GeneralComponent/admin/CommanderMenu"
import MenuAppBar from "./GeneralComponent/main/MenuAppBar"
import Role from "./Roles/Role";
import VerticalGraph from "./GeneralComponent/admin/graphs/VerticalGraph"
import { getAllSubmissionsInMajor, getSoldiersByMajors, getUserInfoByJWT } from "./HelperJS/extract_info"
import { Major } from "./HelperJS/Major"
import { Status } from "./GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"
import OK_Status from "./soldierOperationSideBar/soldierSubmission/OK_Status"
import { Grid } from "@material-ui/core"
import TesterMenu from "./GeneralComponent/tester/TesterMenu"


export default class General extends React.Component {

	constructor(props) {
        super(props);

		this.myRole = undefined;
		this.allMajors = [Major.Firmware,Major.Software, Major.Reserach, Major.Validation];
		this.majorSubmissions = {};
		this.majorSoldierAmount = {};

		this.major = {};
		this.majorSubmissionsAmount = {};
		this.tablesToFinish = 3;

		this.yellow = Status.SubmittedNotGoodEnough;
		this.blue = Status.SubmittedNotReviewed;
		this.green = Status.SubmittedGoodEnough;

		this.state = {
            FOO: 5,
        };
    }

	getMajorsUsers() {
		
		for (const major of this.allMajors) {
			let majorToGet = [];
			majorToGet.push(major);
	
			getSoldiersByMajors(majorToGet).then((response) => {

				if (response !== undefined) {

					if (response.data !== undefined) {
						
						// sets state soldier with id & first name only
						this.majorSoldierAmount[majorToGet] = response.data.length ;
					} else {
						this.majorSoldierAmount[majorToGet] = 0;
					}
				}
				else {
					
					this.majorSoldierAmount[majorToGet] =  0;
				}

				this.setState({FOO: this.state.FOO + 1});
			});
		}
	}

	getMajorsSubmissions(majors) {

		for (const major of this.allMajors) {
			getAllSubmissionsInMajor(major).then((submissions) => {
				if (submissions !== undefined) {
					
					//console.log(majors)
					if (majors.includes(major)) {
						this.getAllMyMajorSubmissions(major,submissions);
					}

					if (submissions.data !== undefined) {
						this.majorSubmissionsAmount[major] = submissions.data.length;
					} else {
						this.majorSubmissionsAmount[major] = 0;
					}
				} else {
					this.majorSubmissionsAmount[major] = 0;

				}
				this.setState({FOO: this.state.FOO + 1});
			});
		}
	}

	getAllMyMajorSubmissions(major,submissions) {
		console.log("here")
		let allMajorSubmission = submissions.data;
		let ok = [];
		let not_ok = [];
		let not_reviewed = [];

		for (const submission of allMajorSubmission) {
			let grade = submission.gradeDescription;

			if (grade === undefined) {
				not_reviewed.push(submission);
			} else {
				if (grade === OK_Status.OK) {
					ok.push(submission);
				} else{
					not_ok.push(submission);
				}
			}
		}

		this.ok = ok;
		this.not_ok = not_ok;
		this.not_reviewed = not_reviewed;
		let all = [];
		all.push(ok);
		all.push(not_ok);
		all.push(not_reviewed);
		this.major[major] = all;
	}

	componentDidMount() {
		getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined) {
				
			} else {
				this.myRole = user.data["role"];
				let majors = user.data["major"];
				this.getMajorsUsers();
				this.getMajorsSubmissions(majors);
			}
		});
	}

    render() {		
		let verticalSoldiers = [];
		let verticalSubmissions = [];

		for (const major of this.allMajors) {

			let amountSoldier = this.majorSoldierAmount[major];
			let amountSubmissions = this.majorSubmissionsAmount[major];
			verticalSoldiers.push(amountSoldier);
			verticalSubmissions.push(amountSubmissions);
		}

		let menu = undefined;
		if (this.myRole === Role.Commander || this.myRole === Role.Admin) {
			menu = <CommanderMenu />;
		} else if (this.myRole === Role.Tester) {
			menu = <TesterMenu />;
		}

		return (

			<MenuAppBar 
			menu={menu} 
			role={this.myRole}
			content={
			
				<div>
					<div>
						<Grid container item justify='center' alignItems='center'>
							<CustomCalendar />
							
						</Grid>
					</div>
					
					<div>
						<Grid container item justify='flex-start' alignItems='flex-start'>
							<CustomClock />
						</Grid>
					</div>

					<br />
					<br/>
					<br/>
					<br/>

					<div>
						<h2>#Soldiers in major</h2>
						<VerticalGraph horizontal={this.allMajors} vertical={verticalSoldiers}/>
					</div>

					<div>
						<h2>#Submissions in majors</h2>
						<VerticalGraph horizontal={this.allMajors} vertical={verticalSubmissions}/>
					</div>

					<div style={{width: '600px',height: '300px'}}>
						
						<h2>Submissions' status in your major</h2>


						
					</div>
				
				</div>
			}>
			</MenuAppBar>
		);
    }
}