import  { Component } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button, withStyles } from '@material-ui/core';

import {getListOfAllFiles, uploadSingleFiles} from './file_handle'


const BorderLinearProgress = withStyles((theme) => ({
	root: {
	  height: 15,
	  borderRadius: 5,
	},
	colorPrimary: {
	  backgroundColor: "#EEEEEE",
	},
	bar: {
	  borderRadius: 5,
	  backgroundColor: '#1a90ff',
	},
  }))(LinearProgress);



export default class UploadTryBAR extends Component {
	constructor(props) {
		super(props)
		this.selectFile = this.selectFile.bind(this);
		this.upload = this.upload.bind(this);
		this.uploadFilesEvent = this.uploadFilesEvent.bind(this);

		this.state = {
	
			/////
			progressInfos: [],
			message: [],
	  		fileInfos: [],
			doesSelected: false,
			selectedFiles: undefined,
			fileName: "",
		};
	}


	upload(idx, file){
		let _progressInfos = [...this.state.progressInfos];
		
		console.log("*1")
		uploadSingleFiles(file, (event) => {
				_progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
				this.setState({
					_progressInfos,
				});
		  })
		  .then((response) => {

			console.log("*-2")
			
			console.log(response)
			console.log("*3")

			if (response !== undefined){
				if (response.status === 201 ||response.status === 200 ){
				this.setState((prev) => {
					let nextMessage = [...prev.message, "Uploaded the file successfully: " + file.name];
					return {
						message: nextMessage
						};
					});
			}
			}
			console.log("*4")
			return getListOfAllFiles()

		})
		.then((files) => {
			console.log("*5")
			console.log(files)
			if (files === undefined ){
				files.data = []
			}
			this.setState({
			  fileInfos: files.data,
			});
			console.log("*6")
		  })
		.catch(() => {
			console.log("*7")
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


	uploadFilesEvent(event){

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
		console.log(event.target.files)
		this.setState({
			progressInfos: [],
			selectedFiles: event.target.files,
			doesSelected: true
		});
	}




	componentDidMount() {
		console.log("---1---*")
		getListOfAllFiles().then((files)=>{
			if (files === undefined){


				this.setState({
					//fileInfos: "no files were found on server ",
					fileInfos:[]
				});

			}
			else {
					files = files.data
					console.log(files)
					console.log("---4---*")
	
					let filesNamE = " "
	
					for (const file of files) {
						filesNamE = filesNamE + "||" + file
					}

					this.setState({
						fileInfos: files,
						fileName: filesNamE,
					});
		
			}
		})

	}


	render() {
		const { progressInfos, message, fileInfos, doesSelected} = this.state;
		console.log("++++++")
		console.log(fileInfos)
		console.log("++++++")

		return (
		  <div>

			  
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
	
			<div className="row my-3">
			  <div className="col-8">
				<label className="btn btn-default p-0">
				  <input type="file" multiple onChange={this.selectFile} />
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
	
			<div className="card">
			  <div className="card-header">List of Files</div>
			  <ul className="list-group list-group-flush">
				{fileInfos !== [] &&
				  fileInfos.map((file, index) => (
					<li className="list-group-item" key={index}>
					  <a href={file.url}>{file.file_name}</a>
					</li>
				  ))}
			  </ul>
			</div>
		  </div>
		);
	
	
	
	
	
	
	
	
	
	}


}
