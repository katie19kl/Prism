
import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Table, withStyles } from "@material-ui/core"
import { Status } from "../../GeneralComponent/SubmissionStatus/SoldierSubmissionStatus"
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

	getAllSoldiersMajor() {
		let major = []
		major.push(this.props.selectedMajor)

		if (this.props.mySoldiers === false) {
			// all students
			getSoldiersByMajors(major).then((response) => {
				if (response !== undefined) {

					if (response.data !== undefined) {

						this.processNewSoldiers(response.data)
					}
				}
			})
		}
	}


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


	processNewSoldiers(soldiersFromResponse){

		let allMySoldiers = soldiersFromResponse

		let usersToTable = []
		let term
		for (let user of allMySoldiers) {
			term = { personalId: user.personalId, firstName: user.firstName }
			//console.log(term)
			usersToTable.push(term)
		}
		// server answer id & personalId
		// if different answer => update table

		usersToTable.sort(function (a, b) { return a.firstName.localeCompare(b.firstName) });


		let equal = (JSON.stringify(usersToTable) == JSON.stringify(this.state.soldiers))

		if (!equal) {

			let newSoldiers = usersToTable

			this.getSoldierSubmissions(newSoldiers).then((subData)=>{
				
				//console.log("---submission data---")
				//console.log(subData)
				//console.log("------===========-------------=========-----")
				this.setState({ soldiers: usersToTable, submissionData:subData})
			})


		}
	}


	extractAllMySoldiers() {
		let selectedMajor = this.props.selectedMajor

		//console.log("Calling for students")
		getAllMySoldiers(selectedMajor).then((response) => {
			if (response !== undefined) {
				if (response.data !== undefined) {
					this.processNewSoldiers(response.data)
				}
			}
		})
	}


	componentDidUpdate() {

		console.log("in updating")

		if (this.props.mySoldiers !== this.state.mySoldiers) {

			console.log("1")
			//this.setState({mySoldiers:this.props.mySoldiers})
			this.setState({ mySoldiers: this.props.mySoldiers }, function(){
				let mySoliders = this.props.mySoldiers
				console.log("all my ? " + mySoliders)
				if (mySoliders) {
					this.extractAllMySoldiers()
				} else {
					this.getAllSoldiersMajor()
				}
			})

	

		}



		if (this.props.selectedMajor !== this.state.selectedMajor) {

			console.log("2")
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

		if (this.props.selectedModule !== this.state.selectedModule) {

			console.log("3")
			console.log(this.props.selectedModule)
			console.log("//////.....///////")
			
			this.setState({ selectedModule: this.props.selectedModule }, function () {
				console.log(this.state.soldiers)
				console.log("+-+-+")
				
				this.getSoldierSubmissions(this.state.soldiers).then((subData)=>{
					//console.log("--HERE--")
					//console.log(subData)
					
					this.setState({submissionData:subData}, function(){
						this.getAllSubject()
					})
				})
				/*let mySoliders = this.props.mySoldiers
				if (mySoliders) {
					this.extractAllMySoldiers()
				} else {
					this.getAllSoldiersMajor()
				}*/
				
				//this.getAllSubject()
				
			})



		}
	}


	getSoldierSubmissions(newSoldiers) {
		let major = this.props.selectedMajor
		let module = this.props.selectedModule
		//console.log("------------------module selected-------------------")
		//console.log(module)
		//console.log("-----------------------------------------------------")
		//let soldiers = this.state.soldiers
		let soldiers = newSoldiers
		//console.log("sssssssssssssssssssssssss")
		//console.log(soldiers)
		//console.log("sssssssssssssssssssssssss")

		if (soldiers !== []) {

			return new Promise((resol,rej)=> 
			{
				usersSubmissions(soldiers, major, module).then((res) => {
					if (res !== undefined) {
						if (res.data !== undefined) {
							let submissionData = res.data

							//console.log("-----------------------submission data-------------------------")
							///console.log(submissionData)
							//console.log("------===========-------------=========-----")
							resol(submissionData)
							//this.setState({ submissionData:res.data })
	
						}
						else {
							
							rej(undefined)
						}
					}else {
						rej(undefined)
					}
				})

			});
			
			
		}
	}


	componentDidMount() {

		//console.log("In mounting")
		let mySoliders = this.props.mySoldiers
		// request for only my soldiers
		if (mySoliders) {
			this.extractAllMySoldiers()
		} else {// request for all soldiers of major
			this.getAllSoldiersMajor()
		}

		this.getAllSubject()
	}


	convertToColors(soldierSubmissionData) {



		let idSubjectColors = {}


		for (let key in soldierSubmissionData) {
			//let subjectColor = {}
			let foo = {}

			let subjectColor = []

			let id = key
			let submissions = soldierSubmissionData[key]


			let allSubjects = this.state.subjects

			for (let subject_ of allSubjects) {

				let status = "non assigned"
				let color = Status.Closed


				// existing submission per subject
				for (let submission of submissions) {

					let checked = submission.checked
					let subject = submission.subject

					if (subject === subject_) {
						status = "assigned"
						color = Status.SubmittedNotReviewed

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


			idSubjectColors[id] = subjectColor

		}
		//console.log(idSubjectColors)
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
			
			//console.log("============================")

			//console.log(soldierSubmissionData)
			//console.log(allSoldierDisplay)
			//console.log(personalIdColors)
			//console.log("==========================")

			//console.log("------------------------")


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


								{/************WAS ERROR HERE***********/}
								{
									personalIdColors[soldier.split("\n")[1]].map((term)=>(
										
												<TableCell  className={classes.tableCell} style={{backgroundColor:term.color}}> 
												
												
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
