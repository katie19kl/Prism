
import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Checkbox, FormControlLabel, Table, Typography, withStyles } from "@material-ui/core"
import { Status } from "../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"
import { getSoldiersByMajors, getAllMySoldiers } from "../../HelperJS/extract_info"
import { getSubjectsByModule } from "../CourseFiles/files_request_handler"
import { usersSubmissions } from "./user_submissions"
import { Link } from "react-router-dom"
import CommentIcon from  "@material-ui/icons/Comment"
import OK_Status from "../../soldierOperationSideBar/soldierSubmission/OK_Status"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import {openSubjectToSoldier, getSoldierClosedSubjects, closeSubjectToSoldier} from "./subject_on_demand"
import { CgArrowsMergeAltH } from "react-icons/cg"


//	boxShadow: "5px 2px 5px grey" for row
const useStyles = (theme) => ({

	head: {
		boxShadow: "1px 1px 1px 1px grey",
		background: "white",
		fontWeight: '300%',

		borderTopStyle: "solid",
		//borderTopColor: "#0096ff",
		
		borderTopColor: "black",

	},

	sticky: {
		position: "sticky",
		left: 0,
		//background: "black",
		background: "#3b3745",
		//boxShadow: " 2px 5px #0096ff",

		boxShadow: " 2px 5px black",

		borderRightStyle: "solid",
		borderRightColor: "black",
		display: "tableRowGroup",
		fontWeight: 'bold',
		width: '50px',
		borderBottom: 'solid 3px black',

		//borderLeftStyle: "solid",
		//borderLeftColor: "#0096ff",

		
	},

	tableCell: {
		borderRightStyle: "solid",
		//borderRightStyle: "dotted",
		display: "tableRowGroup",
		//borderRightColor: "#0096ff",//
		borderRightColor: "black",
		//borderBottom: 'dotted 3px #0096ff',
		borderBottom: 'solid 3px black',



		// new by 18.06.21
		borderTopStyle: "solid"
	},
	table: {
		height: "89vh"
	},

});



class TableStatus extends React.Component {


	constructor(props) {
		super(props);

		this.handleOpenningToUser = this.handleOpenningToUser.bind(this)
		this.handleClosingToUser = this.handleClosingToUser.bind(this)

		this.soldierClosed = {}
		

		this.last = false
		

		this.state = {
			selectedMajor: this.props.selectedMajor,
			selectedModule: this.props.selectedModule,
			mySoldiers: this.props.mySoldiers,
			soldiers: [],
			subjects: [],
			submissionData: undefined,


			FOO:0


		}
	}


	handleClosingToUser(soldierId,subject){

		let module =  this.props.selectedModule
		let major = this.props.selectedMajor

		closeSubjectToSoldier(soldierId,major,module,subject).then((responce)=>{
			



			if (responce !== undefined){
				if (responce.status === 201){
					let soldierClosed = this.soldierClosed[soldierId]
					
					let updatedArr = []
					for (const closed of soldierClosed){
						if (closed !== subject){
							updatedArr.push(closed)
						}
					}
					
					this.soldierClosed[soldierId].push(subject) 		
					
					

					this.last = true
					this.setState({FOO: this.state.FOO + 1})
				}
			}
		})

	}


	/*
	 I take care of openning task, also should be taken care of closing task to soldier

	
	*/

	handleOpenningToUser(soldierId, subject){
		

	
		let module =  this.props.selectedModule
		let major = this.props.selectedMajor

		openSubjectToSoldier(soldierId,major,module,subject).then((responce)=>{
			



			if (responce !== undefined){
				if (responce.status === 201){
					let soldierClosed = this.soldierClosed[soldierId]
					
					let updatedArr = []
					for (const closed of soldierClosed){
						if (closed !== subject){
							updatedArr.push(closed)
						}
					}
					this.soldierClosed[soldierId] = updatedArr

	
					this.last = true
					this.setState({FOO: this.state.FOO + 1})
				}
			}
		})
		


		
		
	}



	// extracts all soldiers of major defined in state
	getAllSoldiersMajor() {

		// function expects array of major
		let major = []
		major.push(this.props.selectedMajor)

		if (this.props.mySoldiers === false) {
			// all students
			getSoldiersByMajors(major).then((response) => {
				if (response !== undefined) {

					if (response.data !== undefined) {
						// sets state soldier with id & first name only
						this.processNewSoldiers(response.data)
					}
				}
			})
		}
	}

	// extracts all subject of selected major & module
	getAllSubject() {
		let major = this.props.selectedMajor
		let module = this.props.selectedModule

		getSubjectsByModule(major, module).then((res) => {
			if (res !== undefined) {
				if (res.data !== undefined) {


					this.last = true
					this.setState({ subjects: res.data })

				}
			}
		})
	}

	// given array of soldiers & sets array of id & first names
	processNewSoldiers(soldiersFromResponse) {

		let allMySoldiers = soldiersFromResponse
		


		let usersToTable = []
		let term
		// take neccessary fields only
		for (let user of allMySoldiers) {
			term = { personalId: user.personalId, firstName: user.firstName }
			usersToTable.push(term)
		}

		// server answer VS field value  by { id & personalId }
		usersToTable.sort(function (a, b) { return a.firstName.localeCompare(b.firstName) });
		this.XUIusers = usersToTable

		let equal = (JSON.stringify(usersToTable) === JSON.stringify(this.state.soldiers))
		
		

		// if different answer => update table
		if (!equal) {


			//
			// get personalId-->closed .then ()
			let major = this.props.selectedMajor
			let module = this.props.selectedModule

			getSoldierClosedSubjects(major,module,usersToTable).then((responce) => {

				if (responce !== undefined)
				{
					if (responce.data !== undefined){				
						this.soldierClosed = responce.data

					}
				}
				

				let newSoldiers = usersToTable
				// new soldiers => new submissions have to be exctracted 
				this.getSoldierSubmissions(newSoldiers).then((subData) => {
					
					console.log("ZZZZZZZZZZZZZZZZZZZZZZZ")
					console.log(subData)
					console.log(usersToTable)
					console.log("ZZZZZZZZZZZZZZZZZZZZZZZ")
					// set state with new-arrived soldiers & their submission data
					
					this.last = true
					this.setState({ soldiers: usersToTable, submissionData: subData	})
				})

			})
			//





		}
	}

	// extract ONLY my soldiers in selected major
	extractAllMySoldiers() {

		
		let selectedMajor = this.props.selectedMajor

		getAllMySoldiers(selectedMajor).then((response) => {
			if (response !== undefined) {
				if (response.data !== undefined) {
					this.processNewSoldiers(response.data)
				}
			}
		})
	}


	componentDidUpdate() {
		let x = 45;
		x = 45 * 2

		this.last = false

		// if check box (MySoldiers) state was changed
		if (this.props.mySoldiers !== this.state.mySoldiers) {
		
			this.setState({ mySoldiers: this.props.mySoldiers }, function () {
				let mySoliders = this.props.mySoldiers
			
				if (mySoliders) {
					this.extractAllMySoldiers()
				} else {
					this.getAllSoldiersMajor()
				}
			})
		}


		// If another major was selected
		if (this.props.selectedMajor !== this.state.selectedMajor) {

			this.setState({ selectedMajor: this.props.selectedMajor }, function () {
				// if major was changed => retrieve another students
				let mySoliders = this.props.mySoldiers
				if (mySoliders) {
					this.extractAllMySoldiers()
				} else {
					this.getAllSoldiersMajor()
				}

				this.getAllSubject()
			})

		}

		// if another module was selected
		if (this.props.selectedModule !== this.state.selectedModule) {

			/////////////

			getSoldierClosedSubjects(this.props.selectedMajor,this.props.selectedModule,this.XUIusers).then((responce) => {

				if (responce !== undefined)
				{
					if (responce.data !== undefined){				
						this.soldierClosed = responce.data

					}
				}
				



				this.setState({ selectedModule: this.props.selectedModule }, function () {
					// extract all submissions of new extracted-module
					this.getSoldierSubmissions(this.state.soldiers).then((subData) => {
	
						this.setState({ submissionData: subData }, function () {
							// extract all subjects of new selected-module
							this.getAllSubject()
						})
					})
				})
	
	

			})


		}
	}

	// extracts all submissions of specified soldiers
	getSoldierSubmissions(newSoldiers) {
		let major = this.props.selectedMajor
		let module = this.props.selectedModule
		let soldiers = newSoldiers


		if (soldiers !== []) {

			return new Promise((resol, rej) => {
				usersSubmissions(soldiers, major, module).then((res) => {
					if (res !== undefined) {
						if (res.data !== undefined) {

							let submissionData = res.data
							resol(submissionData)

						}
						else {

							rej(undefined)
						}
					} else {
						rej(undefined)
					}
				})

			});
		}
	}


	componentDidMount() {

		let mySoliders = this.props.mySoldiers
		// request for only my soldiers
		if (mySoliders) {
			this.extractAllMySoldiers()
		} else {
			// request for all soldiers of major
			this.getAllSoldiersMajor()
		}

		this.getAllSubject()
	}

	// converts info from soldier-submissions to appropriate displaying
	convertToColors(soldierSubmissionData) {


		let idSubjectColors = {}

		// key - soldier personalId
		for (let key in soldierSubmissionData) {

			let closedUserSubjects = this.soldierClosed[key]



			// subject-sorted sequence of colors/state/subject-name
			let subjectColor = []


			let id = key
			// submissions of soldier 
			let submissions = soldierSubmissionData[key]




			let allSubjects = this.state.subjects

			// subjects are selected by sub-indexing (on the server side)
			// iterating in same way on subjects as displaying will be done
			for (let subject_ of allSubjects) {

				let closedSubject = true
				if (closedUserSubjects !== undefined){
					
					closedSubject = closedUserSubjects.includes(subject_)
				
				}
				// or not assigned
				let color = Status.OpenNotSubmitted
				let status = "non assigned"


				if (closedSubject){
					color = Status.Closed
					status = "closed"
				}


				// existing submission per subject
				for (let submission of submissions) {
				
					
					let gradeDescription = submission.gradeDescription
					
					// verifying status of submission
					let checked = submission.checked
					let subject = submission.subject

					if (subject === subject_) {
						
		
						status = "assigned"
						color = Status.SubmittedNotReviewed


		
						if (checked && gradeDescription===OK_Status.OK) {

							

					
							
							status = "checked & good"
							color = Status.SubmittedGoodEnough


						}else if (checked && gradeDescription===OK_Status.NOT_OK){


							
					
							
							status = "checked & NOT good"
							color = Status.SubmittedNotGoodEnough 
						}
					}
				}

				subjectColor.push({
					status: status,
					//subject: subject_.split(" ")[1],
					subject: subject_,
					
					color: color
				})
			}

			// soldier id is mapped to array of displaying info (color/subject name/status)
			// actually only color will be enough, but rest is added to have more informative during debugging
			idSubjectColors[id] = subjectColor

		}

		
		return idSubjectColors
	}


	render() {



		if (this.edit !== undefined &&  this.props.editMode !== this.edit){
		
			console.log("00")
			this.last = true
		}
		

		this.edit  = this.props.editMode

		if (!this.last){
			console.log("11")
			return <WaiterLoading/>
		}


		console.log("...........Soldier Closed........")
		console.log(this.soldierClosed)
		let dictValues = Object.values(this.soldierClosed)
		if (dictValues.length > 0){

			console.log(dictValues)
			
			let closed = "x.x"
			for (const arrNames of dictValues){
		
				if (arrNames.length > 0){
					closed = arrNames[0]

				}
			}
			
			console.log(closed)
			let numClosed = closed.split(".")[0]

			console.log(numClosed)
			

			let moduleNum = this.props.selectedModule.split("-")[0] 
			console.log(moduleNum)
			if (moduleNum !== numClosed){
				
				console.log("22")
				return <WaiterLoading/>
			}
		}



		console.log("..................................")
		
		let isEditMode = this.props.editMode
		
		

		let classes = this.props.classes;
		let soldierSubmissionData = this.state.submissionData;


		let allSoldierDisplay = [];
		// prepare for displaying
		for (let soldier of this.state.soldiers) {
			let add = soldier.firstName + "\n" + soldier.personalId;
			allSoldierDisplay.push(add);
		}


		if (allSoldierDisplay.length > 0 && soldierSubmissionData !== undefined) {

			let personalIdColors = this.convertToColors(soldierSubmissionData);
			
			console.log(this.last)
			console.log("33")			

			return (

				// stickyHeader
				<Table className={classes.table} aria-label="simple table">
					{/*horizontal subject displaying*/}
					<TableHead>
						<TableRow className={classes.head}>

							<TableCell className={classes.sticky}>
									<Typography style={{color:"white", fontFamily: 'monospace'}}>
										Student
                                    </Typography>


								</TableCell>

							{this.state.subjects.map((subject, index) => (

								<TableCell
									key={subject} className={classes.tableCell} align="left" style={{ background: '#3b3745'}}>
										
										<Typography style={{color: 'white', fontFamily: 'monospace'}}>
											{subject }
										</Typography>
								
								</TableCell>

							))}
						</TableRow>

					</TableHead>

					<TableBody>

						{/*Vertical frozen bar of all soldiers*/}
						{allSoldierDisplay.map((soldier, index) => (
							<TableRow key={index}>
								<TableCell

									className={classes.sticky}
									component="th"
									scope="row"
								>
                                    <Typography style={{color:"white", fontFamily: 'monospace'}}>
                                        	{soldier}
                                    </Typography>

								</TableCell>


								{ personalIdColors[soldier.split("\n")[1]].length === 0 
									&&
									<TableCell className={classes.tableCell} style={{ backgroundColor: "white" }}>
										No subjects so far
									</TableCell>

								}

								{
									personalIdColors[soldier.split("\n")[1]].map((term) => (

										<TableCell className={classes.tableCell} style={{ backgroundColor: term.color }}>
											
											{isEditMode && term.color === Status.Closed &&

													<div>

														{
													<FormControlLabel
														control={
															<Checkbox
																onChange={() => {this.handleOpenningToUser(soldier.split("\n")[1], term.subject)}}
																name="checkedB"
																color="primary"
															/>
														}
														label="Open"
													
													/>
													}

													</div>

											}

											{isEditMode && term.color === Status.OpenNotSubmitted &&

														<div>

															{
														<FormControlLabel
															control={
																<Checkbox
																	onChange={() => {this.handleClosingToUser(soldier.split("\n")[1], term.subject)}}
																	name="checkedB"
																	color="primary"
																/>
															}
															label="Close"

														/>
														}

														</div>

}



											{ (term.color !== Status.Closed) && (term.color !== Status.OpenNotSubmitted)
											 &&
												<Link 
												to = {"/admin/soldier_status/" + soldier.split("\n")[1] + "/" + this.state.selectedMajor 
													+ "/" + this.state.selectedModule + "/" + term.subject} /*disabled*/>
													
													<CommentIcon /*disabled*/ style={{color:"black", fontSize:15}}>

														<Typography style={{ fontFamily: 'monospace'}}>
															{term.subject.split(" ")[1]}
														</Typography>

														
													</CommentIcon>	
													
												</Link>
											}
											
											{term.subject.split(" ")[1]}

										</TableCell>
									))
								}
							</TableRow>
						))}
					</TableBody>

				</Table>

			)
		}
		else {
			
			console.log("44")
			return <WaiterLoading/>
		}
	}
}
export default withStyles(useStyles, { withTheme: true })(TableStatus)
