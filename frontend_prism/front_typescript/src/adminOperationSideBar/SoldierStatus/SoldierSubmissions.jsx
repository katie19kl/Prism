import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { Table, Typography, withStyles } from "@material-ui/core"
import { getModulesByMajor, getSubjectsByModule } from "../CourseFiles/files_request_handler"
import { usersSubmissions } from "../CourseStatus/user_submissions"
import CommentIcon from  "@material-ui/icons/Comment"
import { Status } from "../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"
import { Link } from "react-router-dom"
import OK_Status from "../../soldierOperationSideBar/soldierSubmission/OK_Status"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import { getSoldierClosedSubjects } from "../CourseStatus/subject_on_demand"


//	boxShadow: "5px 2px 5px grey" for row
/*
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
*/
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
	},
	table: {
		height: "89vh"
	},

});




class SoldierSubmissions extends React.Component {


	constructor(props) {
		super(props);
		this.modules = []
		this.modules_subjects = {}

		this.subjectClosed = {}

		this.state = {
			selectedMajor: this.props.selectedMajor,
			///selectedSoldier: this.props.selectedModule,
			selectedSoldier: this.props.selectedSoldier,
			
			submissionData: undefined,
			module_submissions: undefined

		}
	}


	getSubjectsOfModules(modules, selectedMajor){

		let arrPromises = []
	
		for (const module of modules){
			

			arrPromises.push(getSubjectsByModule(selectedMajor, module).then((res) => {

				return new Promise ((resol, rej) => {
					if (res !== undefined) {
						if (res.data !== undefined) {
		
							let modul_subject = {};
							modul_subject[module] = res.data;
							resol(modul_subject);
		
						} else {
							rej(undefined);
						}
					} else {
						rej(undefined);
					}
				});
			}));
		}

		let allRESOLVEV = Promise.all(arrPromises) 
		//console.log("all pormises are resolved")

		
		return allRESOLVEV;
	}

	getModulesOfMajor(){
		// then () -> getSubjects
		// then () -> submissions
		let selectedMajor = this.props.selectedMajor

		getModulesByMajor(selectedMajor).then((response) => {
			if (response !== undefined) {
		  		let modules_ = response.data
				this.modules = modules_
				
				/////////////////////////////////////////////////////////////
				let soldier = []
				soldier.push({"personalId" : this.props.selectedSoldier})

				let promises = []
				for (const module of modules_){
					let newPromise =  new Promise((resolv, rej)=>{
					
						
						getSoldierClosedSubjects(this.props.selectedMajor,module,soldier).then((responce) => {
			
							if (responce !== undefined)
							{
								if (responce.data !== undefined){				
									//this.soldierClosed = responce.data
									this.subjectClosed[module] = responce.data
									this.soldierClosed = Object.keys(responce.data)
								}else {
									this.subjectClosed[module] = []
									this.soldierClosed = -1
								}
							}else {
								this.subjectClosed[module] = []
								this.soldierClosed = -1
							}
							resolv(responce.data)
				
						})
					});
					promises.push(newPromise)
				}
				Promise.all(promises).then(()=>{

					//console.log("HERE ALL PROMISES MUST BE HERE")
					
					this.getSubjectsOfModules(modules_, selectedMajor).then((modules_subjects)=>{

						let mod_sub = {};
						for (const dict_mod_sub of modules_subjects){
	
							for (const [key, value] of Object.entries(dict_mod_sub)) {
								mod_sub[key] = value;
								
							} 
						}
	
						this.modules_subjects = mod_sub;
						
						//END extract subjects of arrived modules					
						// Given subject & modules -> extract all submission of choosen user
						this.getAllUserSubmissions(modules_subjects)
						
					});
				})		
			}
		});
	}

	getAllUserSubmissions(modules_subjects){
		
		let currentSoldier = this.props.selectedSoldier
		let selectedMajor = this.props.selectedMajor

		// function expects to recieve array of soldiers id
		let soldiers = []
		soldiers.push({personalId:currentSoldier})

		let arrPromises = []
		let modules_submissions_ = {}

		// take element from key afterward
		for (const module_sub_map of modules_subjects){
			
			// user submission of each module
			for (const module in module_sub_map){
				

			//Each promise extracts user submission of specific module
			let promise_submission = new Promise((resolv, rej)=>{
				
				usersSubmissions(soldiers,selectedMajor,module).then((res)=>{
					if (res !== undefined){
						if (res.data !== undefined){
							
							modules_submissions_[module] = res.data
							resolv(modules_submissions_)
						}
						else {
							rej(undefined)
						}
					}else {
						rej(undefined)
					}

				})
			}) 
			
			// list of promises. 
			arrPromises.push(promise_submission)	
	
			}
			
		}
		// wait for all responces to be resolved
		Promise.all(arrPromises).then(()=>{
			this.setState({module_submissions: modules_submissions_})
		})

	}

	componentDidUpdate() {
		
		// if new major was selected		
		if (this.state.selectedMajor !== this.props.selectedMajor){
			this.setState({selectedMajor : this.props.selectedMajor})
		}

		// if new soldier was selected
		if (this.state.selectedSoldier !== this.props.selectedSoldier){
			

			// Re-render & extract info of new soldier 
			this.setState({selectedSoldier : this.props.selectedSoldier}, function() {
				this.extractAllNeededData()
			})
		}
        
	}

	/* starts extracting process as sequence of <callbacks
	1- Module of major
	2- Subjects of modules
	3- Submissions of modules
	*/
	extractAllNeededData(){
		
		this.getModulesOfMajor()
	}

	componentDidMount() {
		
		this.extractAllNeededData()
		
	}

	// Converts info of submission to corresponding color to display in table
	convertToColors(){
		let submissions_ = this.state.module_submissions
		let selectedSoldier = this.props.selectedSoldier

		let mod_subject_colors = {}		
		


		
		for (let module_ in submissions_){

			let module = submissions_[module_]
			
			
			let subjectClosed = this.subjectClosed[module_][this.props.selectedSoldier]
			if (subjectClosed === undefined){
				subjectClosed = []
			}
	


			// submission of user from server
			let soldier_submissions = module[selectedSoldier]
			
			let subjects = {}
			if (soldier_submissions === undefined){
				continue
			}
			for (let submission of soldier_submissions){

				


				let subject = submission.subject
				let grade =  submission.grade
				// color to display in table
				
				let color = Status.Closed

				
	
				if (subjectClosed.includes(subject)){

					color = Status.OpenNotSubmitted
				}


				let gradeDescription = submission.gradeDescription


				if (submission.checked && gradeDescription === OK_Status.OK) {
					color = Status.SubmittedGoodEnough
				}
				else if (submission.checked && gradeDescription === OK_Status.NOT_OK) {
					color = Status.SubmittedNotGoodEnough
				} else if (!submission.checked){
					color = Status.SubmittedNotReviewed
				}
				// subject -> its submission info for displaying
				subjects[subject] = {color:color, grade:grade, hasReview:submission.checked, ok_not_ok:gradeDescription}
			}
			mod_subject_colors[module_] = subjects

		}
		// Module -> {subect -> submission}
		return mod_subject_colors
	}



	render() {
        
		console.log("Closed stuff of soldier is")
		console.log(this.subjectClosed)
		console.log(this.soldierClosed)
		console.log("--------------------------")

        let classes = this.props.classes

        // all steps of extracting data were finished
        let displayTable = (this.state.module_submissions !== undefined && this.subjectClosed !== undefined)
		
		// prevents case when soldier was changed 
		// but updated response till arrived
		if (this.soldierClosed !== undefined){
			displayTable = (this.props.selectedSoldier === this.soldierClosed[0])
		}
		
		if (displayTable && 1) {

			let mod_subject_colors = this.convertToColors()
		
			return (

						// stickyHeader
						<Table className={classes.table} aria-label="simple table" >
						
						<TableBody>


							{/*All rows. Module -> subject & submission*/}
							{this.modules.map((module, index) => (
								<TableRow key={module}>
									<TableCell

										className={classes.sticky}
										component="th"
										scope="row"
									>
		
									{/*Vertical frozen bar of all modules*/}
									<Typography style={{color:"white", fontFamily: 'monospace'}}>
										{module}					
                                    </Typography>
										

									</TableCell>

									{

									this.modules_subjects[module].length === 0 &&

										<Typography>
										No subjects so far 
										</Typography>
									}
									
									

									
									
									
									{
								
										

										this.modules_subjects[module].map((subject_name) => (





											// verify existence of all needed data 
												
												mod_subject_colors[module] !== undefined 
												&&
												mod_subject_colors[module][subject_name] !== undefined
												
												? // If module & subject exist & submission
												<TableCell className={classes.sticky} style={{ backgroundColor: mod_subject_colors[module][subject_name].color}}>
													{// display navigation icon iff review exist
													//mod_subject_colors[module][subject_name].hasReview
													// &&
														<Link to = {"/admin/soldier_status/" + this.state.selectedSoldier + "/" + 
															this.state.selectedMajor + "/" + module + "/"
															+ subject_name }>
														
															<CommentIcon style={{color:"black", fontSize:15}}>
				
															</CommentIcon>	
														
														</Link>
													}
													
													<Typography style={{ fontFamily: 'monospace'}}>
																	
														{
															/*mod_subject_colors[module][subject_name].color + "-"+*/ 
															subject_name.split(" ")[1]
														}
		
												 	</Typography>
												
												</TableCell>
												: // lack of data (or not submitted)
												
												
												// Takes care of closed/opened subjects
												(
												this.subjectClosed[module][this.props.selectedSoldier].length > 0
												&& 
												this.subjectClosed[module][this.props.selectedSoldier].includes(subject_name))
												?
												<TableCell className={classes.sticky} style={{ backgroundColor: Status.Closed/*"orange"*/ }}>
												{
													subject_name.split(" ")[1] //+ " not submitted "
												}
												</TableCell>
												:
												<TableCell className={classes.sticky} style={{ backgroundColor: Status.OpenNotSubmitted/*"orange"*/ }}>
												{
													subject_name.split(" ")[1] //+ " not submitted "
												}
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
			return <WaiterLoading/>
		}

	}

}
export default withStyles(useStyles, { withTheme: true })(SoldierSubmissions)
