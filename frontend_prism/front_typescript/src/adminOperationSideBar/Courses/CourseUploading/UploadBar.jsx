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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { blue, purple } from "@material-ui/core/colors";
import Role from "../../../Roles/Role";
import {uploadSingleSubmission} from "./../../../soldierOperationSideBar/soldierSubmission/submission_handling"
import SoldierInfo from "../../../soldierOperationSideBar/soldierProfile/SoldierInfo";
import { getUserInfoByJWT } from "../../../HelperJS/extract_info";


const useStyles = (theme) => ({
	root: {
	  	flexGrow: 1,
		marginLeft: theme.spacing(2),
	},
	demo: {
	 	backgroundColor: theme.palette.background.paper,
	},
	title: {
	  	margin: theme.spacing(4, 0, 2),
	  	fontFamily: "monospace",
	},
	myFont: {
		fontFamily: "Comic Sans MS, Comic Sans, cursive",
	},
	myFont2: {
		fontFamily: "Comic Sans MS, Comic Sans, cursive",
		color: purple[400],
	},
	myFont3: {
		fontFamily: "Comic Sans MS, Comic Sans, cursive",
		color: blue[300],
	},
	padding: {
		marginRight: theme.spacing(10),
	},
	button: {
		marginLeft: theme.spacing(2),
	}
});


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class UploadBar extends Component {
	constructor(props) {
		super(props);
		this.selectFile = this.selectFile.bind(this);
		this.upload = this.upload.bind(this);
		this.uploadFilesEvent = this.uploadFilesEvent.bind(this);
		this.regrettOnFile = this.regrettOnFile.bind(this);
		this.myRef_toInput = React.createRef();
		this.filesSelected = undefined;
		this.listSameFiles = [];
		this.module = this.props.match.params.module;
    	this.major = this.props.match.params.major;
		this.subject = this.props.match.params.subject;

		// to use right uploader
		this.role = this.props.match.params.role;
		this.funcUploader = undefined;


		
		if (this.role === Role.Commander || this.role === Role.Admin) {
			this.funcUploader =  uploadSingleFiles;
		}
		else if (this.role === Role.MyFiles) {
			this.funcUploader = uploadSingleSubmission;
		}

		this.uploadedFile = [];

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
		
		this.funcUploader(file, (event) => {
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
						let nextMessage = [...prev.message,
							 "Uploaded the file successfully: " + file.name];
						
						
						if (!this.uploadedFile.includes(file.name)) {
							this.uploadedFile.push(file.name);
						}


						const dataAlready = new DataTransfer();
					
						// store already attached files
						if (this.filesSelected !== undefined) {
							for (const file_ of this.filesSelected) {
								if (file_.name !== file.name) {
									dataAlready.items.add(file_);
								}
							}
						}

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

	uploadFilesEvent(_event) {

		const selectedFiles = this.state.selectedFiles;

		let _progressInfos = [];
	
		for (let i = 0; i < selectedFiles.length; i++) {
			_progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
		}
		this.setState({
			progressInfos: _progressInfos, message: [],},
			async () => {
				for (let i = 0; i < selectedFiles.length; i++) {
					await this.upload(i, selectedFiles[i]);
				}
				
			}
		);
	}

	selectFile(_event) {

		const dataAlready = new DataTransfer();
		// store already attached files
		if (this.filesSelected !== undefined) {
			for (const file of this.filesSelected) {
				dataAlready.items.add(file);
			}
		}

		const dataNew = new DataTransfer();

		// store already new selected files
		let lenFilesSelected = this.myRef_toInput.current.files.length
		for(let i = 0; i<lenFilesSelected; i = i + 1) {
			let file = this.myRef_toInput.current.files[i];
			
			dataNew.items.add(file);
		}

		const dataNewMerged = new DataTransfer();

		// Team up two above files storages
		for (const file of dataAlready.files) {
			dataNewMerged.items.add(file);
		}

		for (const file of dataNew.files) {
			let existAlready = 0;

			for (const fileInData of dataNewMerged.files) {
				if (fileInData.name === file.name) {

					existAlready = 1;
					this.setState({sameFileWasAdded:true});
					this.listSameFiles.push(file.name);
				}
			}
			if (existAlready === 0) {
				dataNewMerged.items.add(file);
			}
		}

		// update to be unioned files
		this.filesSelected = dataNewMerged.files;

		this.setState({
			progressInfos: [],
			selectedFiles : dataNewMerged.files,
			doesSelected: true
		});
	}

	regrettOnFile(_event, file_name) {

		const data = new DataTransfer();

		for (const file of this.filesSelected) {
			if (file.name !== file_name) {
				data.items.add(file);
			}
		}

		let newFileList = data.files;
		this.filesSelected = newFileList;

		this.myRef_toInput.current.files = newFileList;

		this.setState({selectedFiles:newFileList});

		if(newFileList.length === 0) {
			this.cancelChoice();
		}
	}

	cancelChoice() {
		this.filesSelected = [];
		
		this.myRef_toInput.current.files = this.state.emptyFileList;
		  
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

	componentDidMount() {
	
		getUserInfoByJWT().then((user)=>{
			if(user !== undefined){
				if (user.data !== undefined){
					this.role = user.data["role"]
					if (this.role === Role.Soldier){
						this.role = Role.MyFiles

						this.done = 1
					}
					if (this.role === Role.Commander ||  this.role === Role.Admin) {
						this.funcUploader =  uploadSingleFiles;
					}
					else if (this.role === Role.MyFiles) {
						this.funcUploader = uploadSingleSubmission;
					}

				}
			}

			this.setState({emptyFileList:this.myRef_toInput.current.files});	
	
			
		})
		
	}

	render() {

		const { classes } = this.props;
		const { progressInfos, message, doesSelected} = this.state;
		
		let uploaded_files = [];

		if (this.filesSelected !== undefined ) {
			for (const file of this.filesSelected) {
				uploaded_files.push(file.name);
			}
		}
	
		let copiedFiles = "";
		for (const fileName of this.listSameFiles) {
			copiedFiles += fileName + " ,  ";
		}

		let uploadedToServer = this.uploadedFile;

		let menu_  = "";
		let role_ = "";


		if (this.role === Role.Commander) {
			menu_ = <CommanderMenu />;
			role_ = Role.Commander;

		} else if (this.role === Role.MyFiles) {
			menu_ = <SoldierInfo />;
			role_ = Role.Soldier;
		} else if (this.role === Role.Admin){
			menu_ = <CommanderMenu />;
			role_ = Role.Admin;
		}


	
		return (
			<MenuAppBar menu={menu_} role={role_}
			content={
				<div className={classes.root}>
					
					<br/>

					<Grid container item xs={12} justify="center" alignItems="center">
						<Breadcrumbs 
						separator={<NavigateNextIcon fontSize="small" />}
						aria-label="breadcrumb" 
						className={classes.padding}>

							<Typography className={classes.myFont}
							variant="h5" 
							color="primary">
								{this.major}
							</Typography>

							<Typography className={classes.myFont2} 
							variant="h5"
							color="primary">
								{this.module}
							</Typography>

							<Typography className={classes.myFont3}
							variant="h5"
							color="primary">
								  {this.subject}
							</Typography>

						</Breadcrumbs>
					</Grid>

					<Grid item xs={12} md={6}>
										
						<Typography variant="h6" className={classes.title}>
							<b>Uploaded files</b>
						</Typography>
					
						<div className={classes.demo}>

							<List >
							{uploadedToServer !== [] &&
							uploadedToServer.map((file,index)=> (

								<ListItem key={index} >
								<DisplayCourseUploadBar file = {file}/>

								<ListItemText
									primary={
									<Typography 
										className={classes.myFont}>{file}
									</Typography>
									}
								/>
								</ListItem>
							))}
							</List>

						</div>

					</Grid>
						
					<Snackbar open={this.state.sameFileWasAdded} autoHideDuration={15000}
						onClose={()=>{this.setState({sameFileWasAdded : false})
										this.listSameFiles = [] }}>

						<Alert 
						onClose={()=>{this.setState({sameFileWasAdded : false}) 
										this.listSameFiles = []}}  
						severity="warning">
						!! Pay attention !!
						<br></br>
						The following files are not added
						<br></br>
						<br></br>
						[ {copiedFiles} ]
						<br></br> 
						<br></br>
						Because they are already attached 
						<br></br>
						If you do want to override an existing file - delete the file and upload a new one
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
					variant="contained" color="primary"
					onClick={()=> this.props.history.goBack()}
						>
						Go back 
					</Button>

					<Button
					variant="contained" color="secondary"
					className={classes.button}
					onClick={() => this.cancelChoice()}
						>
						Cancel All Choices 
					</Button>

					<Grid item xs={12} md={6}>
						
						<Typography variant="h6" className={classes.title}>
							<b>Attached files</b>
						</Typography>
						<div className={classes.demo}>
							<List >
							{uploaded_files !== [] &&
							uploaded_files.map((file,index)=> (

								<ListItem key={index} >
								<DisplayCourseUploadBar file = {file}/>
								<ListItemText
															
									primary={
									<Typography 
										className={classes.myFont}>{file} 
									</Typography>
									}						
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