import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import UploadBar from './UploadBar';


class CourseUploading extends React.Component {

    constructor(props) {
        super(props);
        this.handleGetFilesRequest = this.props.handleGetFilesRequest;

        this.state = {
            chosenMajor: this.props.chosenMajor,
			chosenModule: this.props.chosenModule,
			chosenSubject: this.props.chosenSubject
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

    
    
	render() {
  


        return (
            <div>
                <br/>
                <h2> Upload Files </h2>
                <h6> You may enter more that one file </h6>
                <UploadBar 
                chosenMajor={this.state.chosenMajor}
                chosenModule={this.state.chosenModule}
                chosenSubject={this.state.chosenSubject}
                handleGetFilesRequest={this.handleGetFilesRequest}/>
            </div>
        );
    }
}
	
export default CourseUploading;

