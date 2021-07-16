import React from "react";
import CustomCalendar from "../commonGeneral/CustomCalendar";
import CustomClock from "../commonGeneral/CustomClock";
import CommanderMenu from "./CommanderMenu";
import MenuAppBar from "../main/MenuAppBar";
import Role from "../../Roles/Role";
import VerticalGraph from "./graphs/VerticalGraph";
import { Major } from "../../HelperJS/Major";
import { Status } from "../SubmissionStatusColors/SoldierSubmissionStatus";
import OK_Status from "../../soldierOperationSideBar/soldierSubmission/OK_Status";
import { Grid, Typography, withStyles } from "@material-ui/core";
import TesterMenu from "../tester/TesterMenu";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";
import { 
	getAllSubmissionsInMajor, 
	getSoldiersByMajors, 
	getUserInfoByJWT 
} from "../../HelperJS/extract_info";


const useStyles = (theme) => ({
	div: {
        border: '5px solid rgba(51, 51, 153, 1)',
		background: 'linear-gradient(45deg, #ccffe6 30%, #ccffff 90%)'
    },
	title: {
		color: '#3a3a64',
		fontFamily: 'monospace',
		marginTop: theme.spacing(5),

	},
	padding: {
		marginBottom: theme.spacing(15),
	},
});


class General extends React.Component {

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
						this.majorSoldierAmount[majorToGet] = response.data.length;
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
					
					if (majors.includes(major)){
						this.getAllMyMajorSubmissions(major,submissions)
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

	getAllMyMajorSubmissions(major,submissions){

		let allMajorSubmission = submissions.data;
		let ok = [];
		let not_reviewed = [];
		let not_ok = [];

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

		const { classes } = this.props;

		let verticalSoldiers = [];
		let verticalSubmissions = [];

		for (const major of this.allMajors) {

			let amountSoldier = this.majorSoldierAmount[major];
			let amountSubmissions = this.majorSubmissionsAmount[major];
			verticalSoldiers.push(amountSoldier);
			verticalSubmissions.push(amountSubmissions);
		}

		if (this.myRole === undefined) {
			return <WaiterLoading />;
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
					
					<div className={classes.padding}>
						<Grid container item justify='flex-start' alignItems='flex-start'>
							<CustomClock />
						</Grid>
					</div>

					<div className={classes.div}>
						<Grid container item justify='center' alignItems='center'>

							<Typography variant='h4' 
							className={classes.title}>
								<b>Soldiers in major</b>
							</Typography>

						</Grid>
											
						<VerticalGraph horizontal={this.allMajors} vertical={verticalSoldiers}/>
						
					</div>

					<div className={classes.div}>
						<Grid container item justify='center' alignItems='center'>

							<Typography variant='h4'
							className={classes.title}>
								<b>Submissions in majors</b>
							</Typography>

						</Grid>

						<VerticalGraph horizontal={this.allMajors} vertical={verticalSubmissions}/>
					</div>
				
				</div>
			}>
			</MenuAppBar>
		);
    }
}

export default withStyles(useStyles, { withTheme: true })(General);