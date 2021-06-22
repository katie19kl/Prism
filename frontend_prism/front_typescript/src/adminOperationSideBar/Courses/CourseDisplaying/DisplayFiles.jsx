import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import { IconButton, withStyles } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { blue } from "@material-ui/core/colors";
import { IconContext } from "react-icons";
import { FaPython } from "react-icons/fa"; // python
import { FaFileWord } from "react-icons/fa"; // word
import { FaFileArchive } from "react-icons/fa"; // zip
import {FaFilePdf} from "react-icons/fa"; // pdf
import {GrDocumentTxt} from "react-icons/gr"; // txt
import { defineIconOfFile } from "../file_handle";
import { AiFillFile } from "react-icons/ai"
import Role from "../../../Roles/Role";


const useStyles = (theme) => ({
    padding: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
});


class DisplayFiles extends React.Component {

    constructor(props) {
        super(props);
        this.FileDeletionButtonHandler = this.props.FileDeletionButtonHandler;
        this.determineFileIcons = this.determineFileIcons.bind(this);
        this.fileNameToIcon = {};
        this.role = this.props.role;

        this.state = {
            fileInfos: this.props.files,
        };
    }

    componentDidUpdate() {
        if (this.props.files !== this.state.fileInfos) {
            this.setState({ fileInfos: this.props.files });
        }
    }

    determineFileIcons() {
        const { classes } = this.props;
        if (this.state.fileInfos !== undefined && this.state.fileInfos !== []) {
            
            for (let currFileInfo of this.state.fileInfos) {
                let extention = defineIconOfFile(currFileInfo.file_name);

                if (extention === 'txt') {
                    this.fileNameToIcon[currFileInfo.file_name] = <GrDocumentTxt className={classes.padding}/>;
                } else if (extention === 'pdf') {
                    this.fileNameToIcon[currFileInfo.file_name] = <FaFilePdf className={classes.padding}/>;
                } else if (extention === 'zip') {
                    this.fileNameToIcon[currFileInfo.file_name] = <FaFileArchive className={classes.padding}/>;
                } else if (extention === 'docx') {
                    this.fileNameToIcon[currFileInfo.file_name] = <FaFileWord className={classes.padding}/>;
                } else if (extention === 'py') {
                    this.fileNameToIcon[currFileInfo.file_name] = <FaPython className={classes.padding}/>;
                } else {
                    this.fileNameToIcon[currFileInfo.file_name] = <AiFillFile className={classes.padding}/>;
                }
            }
        }
    }

	render() {

        this.determineFileIcons();


        if (this.state.fileInfos === undefined) {
            this.state.fileInfos = [];
        }// if -> not render

        return (
            <div>
                <br></br>
            
                <div className="card">
                    
                    <div className="card-header">List of Files</div>
                    
                    <ul className="list-group list-group-flush">
                        {this.state.fileInfos !== [] &&
                        this.state.fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>

                            <IconContext.Provider
                            value={{ color: 'black', size: '20px' }}>
                                {this.fileNameToIcon[file.file_name]}
                            </IconContext.Provider>

                                <a href={file.url}>{file.file_name}</a>

                                {(this.role === Role.Commander || this.role === Role.MyFiles ) ? 
                                <IconButton aria-label="delete" style={{ float: 'right'}}
                                onClick={(event) => this.FileDeletionButtonHandler(event, file.file_name)}>                        
                                    <DeleteIcon style={{ color: blue[300]}}/>
                                </IconButton>
                                : ''}

                            </li>
                        ))}
                    </ul>
                </div>       
            </div>
        );
    }
}
	
export default withStyles(useStyles, { withTheme: true })(DisplayFiles);;