import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import { IconButton, withStyles, Typography } from "@material-ui/core";
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
import { getUserInfoByJWT } from "../../../HelperJS/extract_info";
import WaiterLoading from "../../../HelperComponentStuff/WaiterLoading"
import { Status } from "../../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus";


const useStyles = (theme) => ({
    padding: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
    myFont: {
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
    },
    myFont2: {
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        marginLeft: theme.spacing(3),
    },
});


class DisplayFiles extends React.Component {

    constructor(props) {
        super(props);
        this.FileDeletionButtonHandler = this.props.FileDeletionButtonHandler;
        this.determineFileIcons = this.determineFileIcons.bind(this);
        this.fileNameToIcon = {};
        this.role = this.props.role;
        this.notAllowed = this.props.notAllowed;

        this.state = {
            fileInfos: this.props.files,
            myRole: undefined,
        };

        // to display that review exist
        this.submittedForSoldier = this.props.reviewedSubjects
        if (this.submittedForSoldier === undefined){
            this.submittedForSoldier = []
        }
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

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                 
                if (user.data !== undefined){
                        
                    // Retrieve the user info.
                    user = user.data;
                    let trueRole = user["role"];
                    this.setState({ myRole: trueRole });
                }
            }
        });
    }

	render() {
        const { classes } = this.props;
        this.determineFileIcons();

        if (this.state.fileInfos === undefined) {
            this.state.fileInfos = [];
        }

        if (this.state.myRole === undefined) {
            return <WaiterLoading />;
        
        } else {
            
            return (
                <div className={classes.border}>
                    <br></br>
                
                    <div className="card">
                        
                        <div className="card-header"><b> List of Files </b></div>
                        
                        <ul className="list-group list-group-flush">

                            {this.state.fileInfos.length !== 0 ?
                                this.state.fileInfos.map((file, index) => (
                                    <li className="list-group-item" key={index}>    
                                    <IconContext.Provider
                                    value={{ color: 'black', size: '20px' }}>
                                        {this.fileNameToIcon[file.file_name]}
                                    </IconContext.Provider>
        
                                        {// allow to download file
                                        file.url !== undefined &&
                                        <a href={file.url} className={classes.myFont}>{file.file_name}</a>
                                        }
        
                                        {// displaying folder to commander & admin ( with soldier ID)
                                        file.url === undefined && (this.role === Role.Commander || this.role === Role.Admin
                                            || this.role === Role.Tester) &&
                                        <p className={classes.myFont} style={{ display: 'inline-block' }}>{file.file_name}</p>    
                                        }


                                        {// displaying folder to soldier ( without soldier ID) with review
                                        file.url === undefined && file.file_name === Status.Reviewed && this.role === Role.Soldier &&
                                        <p className={classes.myFont} style={{ display: 'inline-block' }}> my solution ( reviewed )</p>    
                                        }
                                        
                                        
                                        {// displaying folder to soldier ( without soldier ID) ( without review)
                                        file.url === undefined && file.file_name !== Status.Reviewed && this.role === Role.Soldier &&
                                        <p className={classes.myFont} style={{ display: 'inline-block' }}> my solution</p>    
                                        }
        
        
                                        { /* this.role indicates to which role we are displaying the files for.
                                           * this.state.myRole indicates the current logged-in user's role
                                           */
                                        ((this.role === Role.Commander || this.role === Role.MyFiles ||
                                           this.role === Role.Tester || this.role === Role.Admin) 
                                        && (file.url !== undefined) && 
                                        !((this.state.myRole === Role.Tester || this.state.myRole === Role.Commander || this.state.myRole === Role.Admin)
                                        && this.role === Role.MyFiles)) ?
                                        
                                        <IconButton aria-label="delete" style={{ float: 'right'}}
                                        onClick={(event) => this.FileDeletionButtonHandler(event, file.file_name)}>                        
                                            <DeleteIcon style={{ color: blue[300]}}/>
                                        </IconButton>
                                        : ''}
        
                                    </li>
                                )) : <Typography className={classes.myFont2} style={{display: 'inline-block'}}>Empty</Typography>
                            }
                        </ul>
                    </div>       
                </div>
            );
        } 
    }
}
	
export default withStyles(useStyles, { withTheme: true })(DisplayFiles);;