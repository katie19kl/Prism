import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import PublishIcon from '@material-ui/icons/Publish';
import Role from "../../../Roles/Role";


class CourseUploading extends React.Component {

    constructor(props) {
        super(props);

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
            + "/" + this.state.chosenSubject + "/" + Role.Commander;

        let url = "/file_uploading/" + urlPostfix;

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
            </div>
        );
    }
}
	
export default CourseUploading;

