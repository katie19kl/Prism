
import React from "react"
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Table, withStyles } from "@material-ui/core"
import { getModulesByMajor, getSubjectsByModule } from "../CourseFiles/files_request_handler"
import { Major } from "../../HelperJS/Major"
import { usersSubmissions } from "../CourseStatus/user_submissions"



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

		for (const module_sub_map of modules_subjects){
			
			for (const module in module_sub_map){
				

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
			
			arrPromises.push(promise_submission)	
	
			}
			
		}
		console.log("7 waiting ...")
		//console.log(modules_submissions_)
		Promise.all(arrPromises)
		//console.log("all pormises are resolved")
		//console.log(modules_submissions_)
		this.setState({module_submissions: modules_submissions_})
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



	render() {
        
        //console.log("------in displaying submissions------")
        //console.log(this.props.selectedSoldier)
        //console.log(this.props.selectedMajor)
		
        let classes = this.props.classes

        let allSoldierDisplay = []

        let displayTable = (this.state.module_submissions !== undefined)

		if (displayTable) {

			//let personalIdColors = this.convertToColors(soldierSubmissionData)
			
			//console.log("^^^^^^^^^11^^^^^^^^^^^^^^")
			//console.log(this.modules)
			//console.log("^^^^^^^^^^^22^^^^^^^^^^^^")
			//console.log(this.modules_subjects)

			//console.log(this.modules[0])
			//console.log(this.modules_subjects[this.modules[0]])
			//console.log("^^^^^^^^^^^33^^^^^^^^^^^^")
			console.log(this.state.module_submissions)
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
										this.modules_subjects[module].map((term) => (

											<TableCell className={classes.tableCell}>

												{term}
												

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
