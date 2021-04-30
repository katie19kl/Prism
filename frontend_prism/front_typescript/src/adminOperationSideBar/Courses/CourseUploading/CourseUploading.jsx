import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import UploadBar from './UploadBar';
import { Link } from "react-router-dom";
import { Button, ListItem, ListItemIcon } from "@material-ui/core";
import PublishIcon from '@material-ui/icons/Publish';


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
  
        let urlPostfix = this.state.chosenMajor + "/" + this.state.chosenModule 
            + "/" + this.state.chosenSubject;

        let url = "/admin/file_uploading/" + urlPostfix;

        return (
            <div>
                <br/>

                <Link to={url} style={{ textDecoration: 'none', color:"black" }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                >
                    Upload
                </Button>
                </Link>

                {/* <UploadBar 
                chosenMajor={this.state.chosenMajor}
                chosenModule={this.state.chosenModule}
                chosenSubject={this.state.chosenSubject}
                handleGetFilesRequest={this.handleGetFilesRequest}/>*/}
            </div>
        );
    }
}
	
export default CourseUploading;

