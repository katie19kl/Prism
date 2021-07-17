import React from "react";
import CustomCalendar from "../commonGeneral/CustomCalendar";
import CustomClock from "../commonGeneral/CustomClock";
import MenuAppBar from "../main/MenuAppBar";
import { Grid, Typography, withStyles } from "@material-ui/core";
import WaiterLoading from "../../HelperComponentStuff/WaiterLoading";
import SoldierMenu from "./SoldierMenu";
import VerticalGraph from "./../admin/graphs/VerticalGraph";
import { 
	getAllSoldierSubmissions, 
	getSoldierOpened, 
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
		marginBottom: theme.spacing(7),
	},
});


class GeneralSoldier extends React.Component {

    constructor(props) {
        super(props);
		this.ok_amount = 0;
		this.not_ok_amount = 0;
		this.not_checked = 0;

        this.state = {
			my_role:undefined,
			amountSubmitted:-1,
			amountOpened: -1,
		};
    }

	componentDidMount() {
		getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined) {
				
			} else {
				this.myRole = user.data["role"];
                let personalId = user.data["personalId"];
				
				// extract my submissions
                getAllSoldierSubmissions(personalId).then((submissions) => {
                    if (submissions !== undefined) {
						if (submissions.data !== undefined) {
							
							for (const submission of submissions.data) {

								if (submission.isChecked) {

									if (submission.gradeDescription === "OK") {
										this.ok_amount += 1;
									} else {
										this.not_ok_amount += 1;
									}

								} else {
									this.not_checked += 1;
								}
							}

							let amountSubmitted = submissions.data.length;
							
							// extract opened subjects 
							// complement ones are closed
							getSoldierOpened(personalId).then((subjectOnDemands) => {

								if (subjectOnDemands !== undefined) {
									if (subjectOnDemands.data !== undefined) {

										let amountOpened = 0;
										let openedSubjects = subjectOnDemands.data[0].moduleToOpenedSubjects;
										
										for (const [key, val] of Object.entries(openedSubjects)) {
											
											amountOpened = amountOpened + val.length;
										}

										this.setState({
											my_role:this.myRole,
											amountSubmitted: amountSubmitted,
											amountOpened: amountOpened
										});
									}
								}
							});
						}
					}
                });
			}
		});
	}

    render() {

		const { classes } = this.props;
		
		if (this.myRole === undefined) {
			return <WaiterLoading />;
		}

		let submittedAmount = this.state.amountSubmitted;
		let openedAmount = this.state.amountOpened;
		let okAmount = this.ok_amount;
		let notOkAmount = this.not_ok_amount;
		let notCheckedAmount = this.not_checked;


		return (

			<MenuAppBar 
			menu={<SoldierMenu/>} 
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

					<br />
					<br/>
					<br/>

					<div className={classes.div}>
						<Grid container item justify='center' alignItems='center'>

							<Typography variant='h4' className={classes.title}>
								<b>Assignment Status</b>
							</Typography>
						</Grid>
						
						<VerticalGraph horizontal={["Submitted", "Opened", "To submit"]} 
						vertical={[submittedAmount, openedAmount, openedAmount-submittedAmount]}/>
					</div>

					<div className={classes.div}>
						<Grid container item justify='center' alignItems='center'>
							
							<Typography variant='h4' className={classes.title}>
								<b>Assignment Review</b>
							</Typography>

						</Grid>
					
						<VerticalGraph horizontal={["Done Well", "Re-do", "Not Checked"]} 
						vertical={[okAmount, notOkAmount, notCheckedAmount]}/>
					
					</div>
					
				</div>
			}>
			</MenuAppBar>
		);
    }
}

export default withStyles(useStyles, { withTheme: true })(GeneralSoldier);