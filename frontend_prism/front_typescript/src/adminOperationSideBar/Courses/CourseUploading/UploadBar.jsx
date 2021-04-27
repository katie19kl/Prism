import  { Component } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button } from '@material-ui/core';

import { uploadSingleFiles } from '../file_handle'
import DisplayFiles from "../CourseDisplaying/DisplayFiles";



export default class UploadBar extends Component {
	constructor(props) {
		super(props)

		this.selectFile = this.selectFile.bind(this);
		this.upload = this.upload.bind(this);
		this.uploadFilesEvent = this.uploadFilesEvent.bind(this);

		this.state = {
	
			/////
			progressInfos: [],
			message: [],
			doesSelected: false,
			selectedFiles: undefined,
			fileName: "",
		};
	}


	upload(idx, file) {
		let _progressInfos = [...this.state.progressInfos];
		
		console.log("*---1")
		uploadSingleFiles(file, (event) => {
				_progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
				this.setState({
					_progressInfos,
				});
		  }, this.choosen_major, this.choosen_module, this.choosen_subject)
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
			
				else if (response.status >= 400){
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
			console.log("*4____--___--___---___---___---___---___-_---______--_-")
			console.log(this.choosen_subject)
			//return getListOfAllFiles(this.choosen_major, this.choosen_module, this.choosen_subject);

		
		}).catch(error => {
			console.log("_=_=_=_=_=_=_=_")
			console.log(error)
			
			_progressInfos[idx].percentage = 0;
			this.setState((prev) => {
				let nextMessage = [...prev.message, "Could not upload the file: " + file.name];
				  return {
					  progressInfos: _progressInfos,
					  message: nextMessage
				  };
			});


		})
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
		console.log(event.target.files)
		this.setState({
			progressInfos: [],
			selectedFiles: event.target.files,
			doesSelected: true
		});
	}


	render() {

		let fileInfos_FOO_ONLY = [
			{
			url:"xui_1",
			file_name: "pidor_1"
			},
			{
				url:"xui_2",
				file_name: "pidor_2"
			}
		]
		const { progressInfos, message, doesSelected} = this.state;
		
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

			<DisplayFiles 
				files={fileInfos_FOO_ONLY}>
			</DisplayFiles>

		  </div>
		);
	}
}
