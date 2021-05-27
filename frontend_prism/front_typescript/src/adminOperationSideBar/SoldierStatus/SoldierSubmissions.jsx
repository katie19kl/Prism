
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




		this.state = {
			selectedMajor: this.props.selectedMajor,
			selectedSoldier: this.props.selectedModule,
			
			submissionData: undefined,

			FOO: false

		}



	}


	getSubjectsOfModules(modules, selectedMajor){

		let arrPromises = []
		console.log("3")
		console.log("starting iterate module module & retrieve subjects of each module module")
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
		let selectedMajor = this.state.selectedMajor
		console.log("Selected major is " + selectedMajor)

		getModulesByMajor(selectedMajor).then((response) => {
			if (response !== undefined) {
		  		let modules_ = response.data
				console.log("2")
				console.log("Arrived modules" )
				console.log(modules_)
				console.log("Starting extract subjects of arrived modules.....")
				
				this.getSubjectsOfModules(modules_, selectedMajor).then((modules_subjects)=>{

					console.log(modules_subjects)
					console.log("5")
					console.log("END extract subjects of arrived modules.....?")
					
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

		console.log(modules_subjects)

		let arrPromises = []
		let modules_submissions = {}

		for (const module_sub_map of modules_subjects){
			for (const module in module_sub_map){
				

			let promise_submission = new Promise((resolv, rej)=>{
				
				
			
				setTimeout(function(){		
				
					usersSubmissions(soldiers,selectedMajor,module).then((res)=>{
					if (res !== undefined){
						if (res.data !== undefined){

							modules_submissions[module] = res.data
							resolv(modules_submissions)
						}
						else {
							rej(undefined)
						}
					}else {
						rej(undefined)
					}

					})
				
				}, 5000);

			}) 


			arrPromises.push(promise_submission)	
	
			}
			
		}
		console.log("7 waiting ...")
		console.log(modules_submissions)
		Promise.all(arrPromises)
		console.log("all pormises are resolved")
		console.log(modules_submissions)
		
	}






	componentDidUpdate() {

		// if new soldier was selected
        
        // if new major was selected
	}



	componentDidMount() {

		this.getModulesOfMajor()
	}



	render() {
        
        console.log("------in displaying submissions------")
        console.log(this.props.selectedSoldier)
        console.log(this.props.selectedMajor)
		console.log(this.state.FOO)


        let classes = this.props.classes

        let allSoldierDisplay = []

        let x = 1

		if (x) {

			//let personalIdColors = this.convertToColors(soldierSubmissionData)

			return (


			<h2> TABLE HERE </h2>



			)
		}
		else {
			return <h2> ssssssssssssssssssssssss</h2>
		}

	}

}
export default withStyles(useStyles, { withTheme: true })(SoldierSubmissions)
