import React from "react"
import CustomCalendar from "../commonGeneral/CustomCalendar"
import CustomClock from "../commonGeneral/CustomClock"
import MenuAppBar from "../main/MenuAppBar"
import {getAllSoldierSubmissions,  getSoldierOpened, getUserInfoByJWT } from "../../HelperJS/extract_info"
import { Grid } from "@material-ui/core"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import SoldierMenu from "./SoldierMenu"
import VerticalGraph from "./../admin/graphs/VerticalGraph"
import { getSoldierClosedSubjects } from "../../adminOperationSideBar/CourseStatus/subject_on_demand"





export default class GeneralSoldier extends React.Component {

    constructor(props) {
        super(props);

		this.ok_amount = 0
		this.not_ok_amount = 0
		this.not_checked = 0

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
				let majors = user.data["major"];
                let personalId = user.data["personalId"]
				
               
				console.log("||||||||-----------||")
				
                getAllSoldierSubmissions(personalId).then((submissions)=>{
                    if (submissions !== undefined){
						if (submissions.data !== undefined){
							
							console.log("----------------")
							console.log(submissions.data)
							for (const submission of submissions.data){
								if (submission.isChecked){
									if (submission.gradeDescription === "OK"){
										this.ok_amount += 1 
									}else {
										this.not_ok_amount += 1
									}

								}else {
									this.not_checked += 1 
								}
							}

							console.log("----------------")
							let amountSubmitted = submissions.data.length
							
							getSoldierOpened(personalId).then((subjectOnDemands)=>{

								if (subjectOnDemands !== undefined){
									if (subjectOnDemands.data !== undefined){

										let amountOpened = 0
										let openedSubjects = subjectOnDemands.data[0].moduleToOpenedSubjects
										
										for(const [key, val] of Object.entries(openedSubjects)) {
											console.log(key);
											console.log(val);
											
											amountOpened = amountOpened + val.length
										}


										console.log(amountOpened)
										console.log(amountOpened)
										console.log(amountOpened)

										console.log(amountOpened)

										this.setState({my_role:this.myRole,
														amountSubmitted: amountSubmitted,
														amountOpened: amountOpened
													})


									}
								}


							})
							
						}
					}
                })

			}
		});
	}

    render() {		
		

		if (this.myRole === undefined) {
			return <WaiterLoading />;
		}

		let submittedAmount = this.state.amountSubmitted
		let openedAmount = this.state.amountOpened
		console.log(submittedAmount)
		console.log(openedAmount)


		let okAmount = this.ok_amount
		let notOkAmount = this.not_ok_amount
		let notCheckedAmount = this.not_checked


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
					
					<div>
						<Grid container item justify='flex-start' alignItems='flex-start'>
							<CustomClock />
						</Grid>
					</div>

					<br />
					<br/>
					<br/>



					<Grid container item justify='center' alignItems='center'>
						<div style={{width:"50%"}}>
							
							<h2>My open and not submitted AND submitted</h2> 
						
						<VerticalGraph horizontal={["Submitted", "Opened", "To submit"]} vertical={[submittedAmount,openedAmount,openedAmount-submittedAmount]}/>
					</div>

					
					<div style={{width:"50%"}}>
						<h2>My OK and not OK were given</h2> 
					
						<VerticalGraph horizontal={["OK graded","NOT OK","Not checked"]} vertical={[okAmount,notOkAmount,notCheckedAmount]}/>
					
					</div>
							
					</Grid>

					
				
				</div>
			}>
			</MenuAppBar>
		);
    }
}