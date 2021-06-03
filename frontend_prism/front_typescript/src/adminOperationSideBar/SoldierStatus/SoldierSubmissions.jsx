
import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Table, withStyles } from "@material-ui/core"
import { getModulesByMajor, getSubjectsByModule } from "../CourseFiles/files_request_handler"
import { Major } from "../../HelperJS/Major"
import { usersSubmissions } from "../CourseStatus/user_submissions"

import { Status } from "../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"



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





class SoldierSubmissions extends React.Component {


	constructor(props) {
		super(props);


		this.modules = []
		this.modules_subjects = {}


		this.XUI = []
		this.mod = []

		this.state = {
			selectedMajor: this.props.selectedMajor,
			selectedSoldier: this.props.selectedModule,
			
			submissionData: undefined,

			module_submissions: undefined

		}



	}


	getSubjectsOfModules(modules, selectedMajor){

		let arrPromises = []
		console.log("3")
		//console.log("starting iterate module module & retrieve subjects of each module module")
		for (const module of modules){
			

			arrPromises.push(getSubjectsByModule(selectedMajor, module).then((res) => {

				return new Promise ((resol, rej)=>{
					if (res != undefined) {
						if (res.data != undefined) {
		
							let modul_subject = {}
							modul_subject[module] = res.data
							resol(modul_subject)
		
						}
						else {
							rej(undefined)
						}
					}else {
						rej(undefined)
					}
				})
				
			}))
		}
		console.log("4")

		let allRESOLVEV = Promise.all(arrPromises) 
		console.log("all pormises are resolved")
		

		
		console.log(allRESOLVEV)
		return allRESOLVEV


		
		

	}

	getModulesOfMajor(){
		// then () -> getSubjects
		// then () -> submissions
		console.log("1")
		//let selectedMajor = this.state.selectedMajor
		let selectedMajor = this.props.selectedMajor
		//console.log("Selected major is " + selectedMajor)

		getModulesByMajor(selectedMajor).then((response) => {
			if (response !== undefined) {
		  		let modules_ = response.data
				console.log("2")
				//console.log("Arrived modules" )
				//console.log(modules_)
				this.modules = modules_
				//console.log("Starting extract subjects of arrived modules.....")
				
				this.getSubjectsOfModules(modules_, selectedMajor).then((modules_subjects)=>{

					let mod_sub = {}
					for (const dict_mod_sub of modules_subjects){

						for (const [key, value] of Object.entries(dict_mod_sub)) {
							mod_sub[key] = value
						  } 
					}

					this.modules_subjects = mod_sub

					//console.log(modules_subjects)
					console.log("5")
					//console.log("END extract subjects of arrived modules.....?")
					
					this.getAllUserSubmissions(modules_subjects)
					
				})
				
			}
		})
		
	}

	getAllUserSubmissions(modules_subjects){
		console.log("6")
		let soldiers = []
		let currentSoldier = this.props.selectedSoldier
		let selectedMajor = this.props.selectedMajor
		soldiers.push({personalId:currentSoldier})
		console.log("Ask about soldier :: " + soldiers[0].personalId)

		//console.log(modules_subjects)

		let arrPromises = []
		let modules_submissions_ = {}

		let x = []

		for (const module_sub_map of modules_subjects){
			
			for (const module in module_sub_map){
				

			let promise_submission = new Promise((resolv, rej)=>{
				
				
				usersSubmissions(soldiers,selectedMajor,module).then((res)=>{
					if (res !== undefined){
						if (res.data !== undefined){
							
							let s = this.props.selectedSoldier
							//console.log(s)
							//console.log(res.data[s])

							modules_submissions_[module] = res.data
							//modules_submissions_[module] = res.data[s]

							x.push(res.data[s])


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
			
			arrPromises.push(promise_submission)	
	
			}
			
		}
		console.log("7 waiting ...")

		Promise.all(arrPromises).then(()=>{
			//this.setState({module_submissions: x})
			this.setState({module_submissions: modules_submissions_})
		})
		
		//this.setState({module_submissions: x})
	}






	componentDidUpdate() {
		console.log("in updating ")
		// if new soldier was selected
		if (this.state.selectedMajor !== this.props.selectedMajor){
			this.setState({selectedMajor : this.props.selectedMajor})
		}

		if (this.state.selectedSoldier !== this.props.selectedSoldier){
			console.log("New soldier was chosen -- " + this.props.selectedSoldier)
			
			this.setState({selectedSoldier : this.props.selectedSoldier}, function() {
				this.extractAllNeededData()
			})
			
		}
        
        // if new major was selected
	}


	extractAllNeededData(){
		this.getModulesOfMajor()
	}

	componentDidMount() {
		
		this.extractAllNeededData()
		
	}

	convertToColors(){
		let submissions_ = this.state.module_submissions
		let selectedSoldier = this.props.selectedSoldier

		let mod_subject_colors = {}		
		

		//console.log("--------------------------")
		
		//console.log(submissions_)
		for (let module_ in submissions_){
			//console.log("1")
			let module = submissions_[module_]
			
			let soldier_submissions = module[selectedSoldier]
			//console.log(soldier_submissions)
			//console.log("2")

			let subjects = {}
			if (soldier_submissions == undefined){
				continue
			}
			for (let submission of soldier_submissions){
				let subject = submission.subject
				let grade =  submission.grade
				let color = Status.Closed
				if (submission.checked){
					color = Status.SubmittedGoodEnough
				}
				//subjects.push({color:color, grade:grade, subject:subject})
				subjects[subject] = {color:color, grade:grade}
			}
			mod_subject_colors[module_] = subjects

		}
		
		//console.log(mod_subject_colors)
		//console.log("-----------???-----------")
		return mod_subject_colors
	}



	render() {
        
        //console.log("------in displaying submissions------")
        //console.log(this.props.selectedSoldier)
        //console.log(this.props.selectedMajor)
		
        let classes = this.props.classes

        let allSoldierDisplay = []

        let displayTable = (this.state.module_submissions !== undefined)

		//console.log(displayTable)

		if (displayTable) {

			let mod_subject_colors = this.convertToColors()
			console.log("========================================")
			
			console.log(mod_subject_colors)

			let module = this.modules[0]

			
			console.log(module)
			
			console.log(mod_subject_colors[module])
			//console.log(mod_subject_colors["1- Module_first"])
			
			//console.log(mod_subject_colors["1- Module_first"]["1.1- subject_a"])
			
			
			console.log("========================================")//console.log(this.modules)
			//console.log("^^^^^^^^^^^22^^^^^^^^^^^^")
			//console.log(this.modules_subjects)

			//console.log(this.modules[0])
			//console.log(this.modules_subjects[this.modules[0]])
			//console.log("^^^^^^^^^^^33^^^^^^^^^^^^")
			//console.log(this.state.module_submissions)
			//console.log("^^^^^^^^^^^^^^^^^^^^^^^")
			//console.log("^^^^^^^^^^^^^^^^^^^^^^^")
			


			return (



						// stickyHeader
						<Table className={classes.table} aria-label="simple table" >
						
						<TableBody>


							{/*Vertical frozen bar of all soldiers*/}
							{this.modules.map((module, index) => (
								<TableRow key={module}>
									<TableCell

										className={classes.sticky}
										component="th"
										scope="row"
									>
										{
											//this.modules_subjects[module]
											module
										}
										
									</TableCell>

									{
										this.modules_subjects[module].map((subject_name) => (



											
												
												mod_subject_colors[module] !== undefined 
												&&
												mod_subject_colors[module][subject_name] !== undefined
												
												?
												<TableCell className={classes.sticky} style={{ backgroundColor: mod_subject_colors[module][subject_name].color}}>
													{
													mod_subject_colors[module][subject_name].color + "-" + subject_name
													}
												</TableCell>
												: 
												<TableCell className={classes.sticky} style={{ backgroundColor: "orange" }}>
												{
													"XUI--" + subject_name
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
			return <h2> ssssssssssssssssssssssss</h2>
		}

	}

}
export default withStyles(useStyles, { withTheme: true })(SoldierSubmissions)
