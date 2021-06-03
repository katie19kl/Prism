
import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Table, withStyles } from "@material-ui/core"
import { Status } from "../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"
import { getSoldiersByMajors, getAllMySoldiers } from "../../HelperJS/extract_info"
import { getSubjectsByModule } from "../CourseFiles/files_request_handler"
import { usersSubmissions } from "./user_submissions"


//	boxShadow: "5px 2px 5px grey" for row
const useStyles = (theme) => ({

	head: {
		boxShadow: "1px 1px 1px 1px grey",
		background: "white",
		fontWeight: '300%',

		borderTopStyle: "solid",
		borderTopColor: "#0096ff",


	},

	sticky: {
		position: "sticky",
		left: 0,
		background: "white",
		boxShadow: " 2px 5px #0096ff",

		borderRightStyle: "solid",
		borderRightColor: "#0096ff",
		display: "tableRowGroup",
		fontWeight: 'bold',
		width: '50px'

		//borderLeftStyle: "solid",
		//borderLeftColor: "#0096ff",

	},

	tableCell: {
		//borderRightStyle: "solid",
		borderRightStyle: "dotted",
		display: "tableRowGroup",
		borderRightColor: "#0096ff",//
		borderBottom: 'dotted 3px #0096ff',






	},
	table: {
		height: "89vh"
	},

});





class TableStatus extends React.Component {


	constructor(props) {
		super(props);




		this.state = {
			selectedMajor: this.props.selectedMajor,
			selectedModule: this.props.selectedModule,
			mySoldiers: this.props.mySoldiers,
			soldiers: [],
			subjects: [],

			submissionData: undefined

		}



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
			if (res != undefined) {
				if (res.data != undefined) {

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


		let equal = (JSON.stringify(usersToTable) == JSON.stringify(this.state.soldiers))
		// if different answer => update table
		if (!equal) {

			let newSoldiers = usersToTable
			// new soldiers => new submissions have to be exctracted 
			this.getSoldierSubmissions(newSoldiers).then((subData) => {

				// set state with new-arrived soldiers & their submission data
				this.setState({ soldiers: usersToTable, submissionData: subData })
			})


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


			this.setState({ selectedModule: this.props.selectedModule }, function () {
				// extract all submissions of new extracted-module
				this.getSoldierSubmissions(this.state.soldiers).then((subData) => {

					this.setState({ submissionData: subData }, function () {
						// extract all subjects of new selected-module
						this.getAllSubject()
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

			// subject-sorted sequence of colors/state/subject-name
			let subjectColor = []


			let id = key
			// submissions of soldier 
			let submissions = soldierSubmissionData[key]


			let allSubjects = this.state.subjects

			// subjects are selected by sub-indexing (on the server side)
			// iterating in same way on subjects as displaying will be done
			for (let subject_ of allSubjects) {

				let status = "non assigned"
				let color = Status.Closed

				// existing submission per subject
				
				for (let submission of submissions) {
					// verifying status of submission
					let checked = submission.checked
					let subject = submission.subject

					if (subject === subject_) {
						status = "assigned"
						color = Status.SubmittedNotReviewed

//////////////////////////////////////////////////////////MUST CHECK BY GRADE-STATUS OK or not OK//////////////////////////////////////

						if (checked) {
							status = "checked"
							color = Status.SubmittedNotGoodEnough // Status.SubmittedGoodEnough
						}
					}
				}

				subjectColor.push({
					status: status,
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

		let classes = this.props.classes
		let soldierSubmissionData = this.state.submissionData


		let allSoldierDisplay = []
		// prepare for displaying
		for (let soldier of this.state.soldiers) {
			let add = soldier.firstName + "\n" + soldier.personalId
			allSoldierDisplay.push(add)
		}



		if (allSoldierDisplay.length > 0 && soldierSubmissionData !== undefined) {

			let personalIdColors = this.convertToColors(soldierSubmissionData)

			return (


				// stickyHeader
				<Table className={classes.table} aria-label="simple table" >
					{/*horizontal subject displaying*/}
					<TableHead >
						<TableRow className={classes.head}>

							<TableCell className={classes.sticky}>
								Student
								</TableCell>

							{this.state.subjects.map((subject, index) => (

								<TableCell key={subject} className={classes.tableCell} align="left">{subject}</TableCell>

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
									{
										soldier
									}
								</TableCell>

								{
									personalIdColors[soldier.split("\n")[1]].map((term) => (

										<TableCell className={classes.tableCell} style={{ backgroundColor: term.color }}>


											{term.subject}

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
			return <h2> ssssssssssssssssssssssss</h2>
		}

	}

}
export default withStyles(useStyles, { withTheme: true })(TableStatus)
