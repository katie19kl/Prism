import  { Component } from "react";
import { Button, withStyles } from '@material-ui/core';
import React from "react"
import {uploadSingleFiles} from './file_uploading_handle'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import {CgRemoveR} from "react-icons/cg"
import MuiAlert from '@material-ui/lab/Alert';	
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import DisplayCourseUploadBar from "./DisplayCoursesUploadBar"


const useStyles = (theme) => ({
	root: {
	  flexGrow: 1,
	  maxWidth: 752,
	},
	demo: {
	  backgroundColor: theme.palette.background.paper,
	},
	title: {
	  margin: theme.spacing(4, 0, 2),
	},
});



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



class UploadBar extends Component {
	constructor(props) {
		super(props)

		this.selectFile = this.selectFile.bind(this);
		this.upload = this.upload.bind(this);
		this.uploadFilesEvent = this.uploadFilesEvent.bind(this);
		this.regrettOnFile = this.regrettOnFile.bind(this)
		this.myRef_toInput = React.createRef();
		this.filesSelected = undefined;
		this.listSameFiles = [];

		this.module = this.props.match.params.module;
    	this.major = this.props.match.params.major;
		this.subject = this.props.match.params.subject;


		this.uploadedFile = []


		this.state = {
	
			progressInfos: [],
			message: [],
			doesSelected: false,
			selectedFiles: undefined,
			fileName: "",
			emptyFileList : undefined,
			sameFileWasAdded : false,
			
		};
	}

	componentDidUpdate() {
        if (this.props.chosenMajor !== this.state.chosenMajor) {
            this.setState({ chosenMajor: this.props.chosenMajor});
        }

        if (this.props.chosenModule !== this.state.chosenModule) {
            this.setState({ chosenModule: this.props.chosenModule});
        }

        if (this.props.chosenSubject !== this.state.chosenSubject) {
            this.setState({ chosenSubject: this.props.chosenSubject});
        }
    }


	upload(idx, file) {
		let _progressInfos = [...this.state.progressInfos];
		
		
		uploadSingleFiles(file, (event) => {
				_progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
				this.setState({
					_progressInfos,
				});
		  }, this.major, this.module, this.subject)
		  .then((response) => {




			if (response !== undefined) {
				if (response.status === 201 || response.status === 200 ) {
					
					if (this.state.chosenSubject !== undefined) {

						// update the view to contain the new file.
						this.handleGetFilesRequest(this.state.chosenSubject);
					}
					this.setState((prev) => {
						let nextMessage = [...prev.message, "Uploaded the file successfully: " + file.name];
						
						
						if (!this.uploadedFile.includes(file.name))
						{
							this.uploadedFile.push(file.name)
						}


						const dataAlready = new DataTransfer();
					
						// store already attached files
						if (this.filesSelected !== undefined){
							for (const file_ of this.filesSelected){
								if (file_.name !== file.name){
									dataAlready.items.add(file_);


									
								}
								
							}
						}

						//this.cancellChoice()
						this.filesSelected = dataAlready.files





						return {
							message: nextMessage
						};
					});
				}
			
				else if (response.status >= 400) {
					_progressInfos[idx].percentage = 0;
					this.setState((prev) => {
						let nextMessage = [...prev.message, "Could not upload the file: " + file.name];
						  return {
							  progressInfos: _progressInfos,
							  message: nextMessage
						  };
					});
				}
			}
		
		}).catch(error => {
			console.log(error)
			
			_progressInfos[idx].percentage = 0;
			this.setState((prev) => {
				let nextMessage = [...prev.message, "Could not upload the file: " + file.name];
					return {
						progressInfos: _progressInfos,
						message: nextMessage
					};
			});
		});
	}

	uploadFilesEvent(event) {

		const selectedFiles = this.state.selectedFiles;

		let _progressInfos = [];
	
		for (let i = 0; i < selectedFiles.length; i++) {
			_progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
		}
		this.setState(
			{
			  progressInfos: _progressInfos,
			  message: [],
			}, () => {
				for (let i = 0; i < selectedFiles.length; i++) {
					this.upload(i, selectedFiles[i]);
				}
				
			} 
		);
	}

	selectFile(event) {


		const dataAlready = new DataTransfer();
		// store already attached files
		if (this.filesSelected !== undefined){
			for (const file of this.filesSelected){
				dataAlready.items.add(file);
			}
		}

		const dataNew = new DataTransfer();

		// store already new selected files
		let lenFilesSelected = this.myRef_toInput.current.files.length
		for(let i = 0; i<lenFilesSelected; i = i + 1){
			let file = this.myRef_toInput.current.files[i]
			
			dataNew.items.add(file);
		}

		
		const dataNewMerged = new DataTransfer();

		// Team up two above files storages
		for (const file of dataAlready.files){
			dataNewMerged.items.add(file);
		}
		for (const file of dataNew.files){
			let existAlready = 0
			for (const fileInData of dataNewMerged.files){
				if (fileInData.name === file.name){
					existAlready = 1
					this.setState({sameFileWasAdded:true})
					
					
					this.listSameFiles.push(file.name)
				}
			}
			if (existAlready === 0){
				dataNewMerged.items.add(file);
			}
		}

		// update to be unioned files
		this.filesSelected = dataNewMerged.files

		this.setState({
			progressInfos: [],
			//selectedFiles: event.target.files,
			selectedFiles : dataNewMerged.files,
			doesSelected: true
		});

	}

	regrettOnFile(event, file_name){

		const data = new DataTransfer();


		for (const file of this.filesSelected){
			if (file.name !== file_name){
				data.items.add(file);
			}
		}


		let newFileList = data.files
		this.filesSelected = newFileList

		this.myRef_toInput.current.files = newFileList

		this.setState({selectedFiles:newFileList})

		if(newFileList.length === 0){
			this.cancellChoice()
		}
	}

	cancellChoice(){
		this.filesSelected = []
		

		this.myRef_toInput.current.files = this.state.emptyFileList 
		  
		this.setState({
			progressInfos: [],
			message: [],
			doesSelected: false,
			selectedFiles: undefined,
			fileName: "",
			sameFileWasAdded: false,
			listSameFiles: []
		});
	}


	componentDidMount(){
	
		this.setState({emptyFileList:this.myRef_toInput.current.files})
	}



	render() {

		const { classes } = this.props;

		const { progressInfos, message, doesSelected} = this.state;
		
		let uploaded_files = []

		if( this.filesSelected !== undefined ){
			for (const file of this.filesSelected){
				uploaded_files.push(file.name)
			}
		}
	
	
		let copiedFiles = ""
		for (const fileName of this.listSameFiles){
			copiedFiles += fileName + " ,  " 
		}

		let uploadedToServer = this.uploadedFile 
	


		return (

			<MenuAppBar menu={<CommanderMenu />} role="Commander" content={
				<div>

					
							
	
					<Grid item xs={12} md={6}>
					
					
						<Typography variant="h6" className={classes.title}>
							Uploaded files
						</Typography>

					
						<div className={classes.demo}>
							<List >
							{uploadedToServer != [] &&
							uploadedToServer.map((file,index)=> (

								<ListItem key={index} >

								<DisplayCourseUploadBar file = {file}/>

								
								<ListItemText
									primary={file} 
								/>
								</ListItem>

								
							))}
							



							</List>
							
						</div>

					</Grid>




			  	<h1>{this.major}</h1>
				<h1>{this.module}</h1>
				<h1>{this.subject}</h1>

			

				<Snackbar open={this.state.sameFileWasAdded} autoHideDuration={15000}
							onClose={()=>{this.setState({sameFileWasAdded : false})
												this.listSameFiles = [] }}>

						<Alert onClose={()=>{this.setState({sameFileWasAdded : false}) 
																this.listSameFiles = []}}  
							severity="warning">
							!! Pay attention !!
							<br></br>
							The following was not uploaded
							<br></br>
							<br></br>
							[ {copiedFiles} ]
							<br></br> 
							<br></br>
							Because it is already attached 
							<br></br>
 							If you do want to override existing file - delete file and upload new one
						</Alert>
				</Snackbar>

					
				{progressInfos &&
				progressInfos.map((progressInfo, index) => (
					<div className="mb-2" key={index}>
					<span>{progressInfo.fileName}</span>
					<div className="progress">
						<div
						className="progress-bar progress-bar-info"
						role="progressbar"
						aria-valuenow={progressInfo.percentage}
						aria-valuemin="0"
						aria-valuemax="100"
						style={{ width: progressInfo.percentage + "%" }}
						>
						{progressInfo.percentage}%
						</div>
					</div>
					</div>
				))}
			

				<div className="row my-3" >
				<div className="col-8">
					<label className="btn btn-default p-0">
					<input ref={this.myRef_toInput} type="file" multiple onChange={this.selectFile}  />
					</label>
				</div>
			
				<div className="col-4">
					<Button
					className="btn-upload"
					color="primary"
					variant="contained"
					disabled={!doesSelected}
					onClick={this.uploadFilesEvent}
					>
					Upload
					</Button>
				</div>

				</div>
				{message.length > 0 && (
				<div className="alert alert-secondary" role="alert">
					<ul>
					{message.map((item, i) => {
						return <li key={i}>{item}</li>;
					})}
					</ul>
				</div>
				)}

				<Button
				variant="contained" color="secondary"
				onClick={() => this.cancellChoice()}
					>
					Cancell All Choices 
				</Button>

				<Grid item xs={12} md={6}>
					
					
					<Typography variant="h6" className={classes.title}>
						Attached files
					</Typography>
					<div className={classes.demo}>
						<List >
						{uploaded_files != [] &&
						uploaded_files.map((file,index)=> (

							<ListItem key={index} >

							<DisplayCourseUploadBar file = {file}/>


							<ListItemText
								primary={file} 
							/>
							<ListItemSecondaryAction>
								<IconButton edge="end" aria-label="delete" color="secondary" 
								onClick={ (event) => this.regrettOnFile(event, file)}>
								<CgRemoveR />
								</IconButton>
							</ListItemSecondaryAction>
							</ListItem>

							
						))}
						



						</List>
						
					</div>

					
		
				

			</Grid>
			</div>
			}>
			</MenuAppBar>
		);
	}
}
export default withStyles(useStyles, { withTheme: true })(UploadBar); 