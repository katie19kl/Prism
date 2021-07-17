import React from "react"
import { getListSubmissionOfSubject, removeFileFromSubmission } from "./submission_handling"
import { Grid, Snackbar, withStyles, Box } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DisplayFiles from "./../../adminOperationSideBar/Courses/CourseDisplaying/DisplayFiles"
import Role from "../../Roles/Role";
import ConfirmationDialog from "../../GeneralComponent/dialogs/ConfirmationDialog";
import { Link } from "react-router-dom";
import SubmissionReview from "./submissionReview/SubmissionReview";
import MuiAlert from '@material-ui/lab/Alert';
import PublishIcon from '@material-ui/icons/Publish';
import { Status } from "../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus";
import OK_Status from "../soldierSubmission/OK_Status"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import { getUserInfoByJWT } from "../../HelperJS/extract_info";


const useStyles = (theme) => ({
    table: {
        minWidth: 650,
        border: '3px solid #adebeb'
    },
    space: {
        marginLeft: theme.spacing(2),
    }
});


/* shows the alert msg when creation attempt is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class SubmissionTableInfo extends React.Component {

    constructor(props) {
        super(props);
        this.deleteFileFromSubmissionHandler = this.deleteFileFromSubmissionHandler.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);
        this.getSubmissionInfo = this.getSubmissionInfo.bind(this);
        this.major = this.props.major;
        this.module = this.props.module;
        this.subject = this.props.subject;
        this.soldierId = this.props.soldierId;
        this.submissionInfo = undefined;
        this.chosenFileName = undefined;
        this.role = this.props.role;
        this.message = undefined;
        this.severity = undefined;

        this.state = {
            infoExtracted: false,
            submmsionExist: false,
            submittedFiles: [],
            isChecked: false,
            submittedTime: undefined,
            submittedDate: undefined,
            gradeDescription: undefined,
            existSubmission: false,
            confirmDialogOpen: false,
            showConfirmDialog: false,
            showMsg: false,
            msgOpen: false,
        };
    }

    componentDidMount() {
        this.getSubmissionInfo();
    }

    getSubmissionInfo() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                if (user.data !== undefined) {

                    this.role  = user.data["role"];

                    if (this.role === Role.Soldier) {
                        this.role = Role.MyFiles;
                    }
                }
            }

            getListSubmissionOfSubject(this.major, this.module, this.subject, this.soldierId)
            .then((result) => {

                if (result === undefined) {

                    // no submission yet
                    this.setState({infoExtracted:true})

                } else {
                    this.submissionInfo = result.data;
                    this.setState({
                        infoExtracted:true,
                        submmsionExist:true,
                        submittedFiles: this.submissionInfo.submittedFiles,
                        isChecked: this.submissionInfo.isChecked,
                        submittedTime: this.submissionInfo.submittedTime,
                        submittedDate: this.submissionInfo.submittedDate,
                        existSubmission: true,
                        gradeDescription: this.submissionInfo.gradeDescription
                    });
                }
            });
        });
    }

    setSubmissionStatus() {

        let checked = this.state.isChecked;
        let submitted = this.state.existSubmission;

        if (this.state.submittedFiles.length === 0 && this.state.existSubmission){
            return "No files in submission"
        }

        if (checked && submitted) {
            return "Submitted & Reviewed";

        } else if (!checked && submitted) {
            return "Submitted & Waiting for review";

        } else {
            return "There was no submission yet";
        }
    }

    setSubmissionColor() {
        let grade = this.state.gradeDescription;
        let checked = this.state.isChecked;
        let submitted = this.state.existSubmission;

        // TO DO
        // ADD WITH OPEN OR NOT OPEN 


        if (this.state.submittedFiles.length === 0 && this.state.existSubmission){
            return Status.OpenNotSubmitted
        }

        if (checked && submitted) {
            
            if (grade === OK_Status.OK) {
                
                // green
                return Status.SubmittedGoodEnough
            }
            else if (grade === OK_Status.NOT_OK){
                
                // yellow
                return Status.SubmittedNotGoodEnough
            }
        } 
        else if (!checked && submitted) {

            // blue 
            return Status.SubmittedNotReviewed;
        }
        else {
            return "";
        }
    }

    handleCloseCancel() {
        this.chosenFileName = undefined;

        this.setState({
            showConfirmDialog: false,
            confirmDialogOpen: false
        });
    }

    handleCloseConfirm() {

        removeFileFromSubmission(this.major, this.module, this.subject, this.chosenFileName)
        .then((res) => {

            if (res !== undefined) {
                if (res.data !== undefined){
                    res = res.data;
                    this.setState({


                        submittedDate: res.submittedDate,
                        submittedTime: res.submittedTime,
                        submittedFiles: res.submittedFiles,
                        showConfirmDialog: false,
                        confirmDialogOpen: false
                    });
                }
            }
        });

        this.chosenFileName = undefined;
    }

    deleteFileFromSubmissionHandler(event, file_name) {


        console.log("deleting file",file_name)
        event.stopPropagation();
        this.chosenFileName = file_name;

        this.setState({
            showConfirmDialog: true,
            confirmDialogOpen: true,
        });
    }

    setReviewContent() {
        
        if (this.state.submittedFiles.length === 0 && this.state.existSubmission) {
            return "No files in submission"
        }

        // if review doesnt exist
        let reviewContent = "There is no review so far";

        if (this.state.isChecked) {
            reviewContent = "You have available review";
        }

        return reviewContent;

    }

    handleMsgClose() {
        this.message = undefined;
        this.severity = undefined;
        this.setState({ showMsg: false, msgOpen: false });
    }

    render() {

        let classes = this.props.classes;
        let submissionStatus = this.setSubmissionStatus();
        let reviewContent = this.setReviewContent();
        let submissionExist = this.state.existSubmission;
        let colorSubmissionStatus = this.setSubmissionColor();
        let urlPostfix = this.major + "/" +  this.module + "/" + this.subject + "/" + Role.MyFiles;
        let url = "/file_uploading/" + urlPostfix;
        let history = this.props.browesHistory;
        let gradeDesc = "No grade given yet";

        if (this.state.gradeDescription !== undefined && this.state.gradeDescription !== "") {
            gradeDesc = this.state.gradeDescription;
        }

        let x = 1

        if (!this.state.infoExtracted) {
            return <WaiterLoading />;
        }

        if (submissionExist || x) {

            return (
                <div         
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"}}>

                {(this.state.showMsg === true) ? 
                    <Snackbar open={this.state.msgOpen} 
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    onClose={this.handleMsgClose}>
                        <Alert onClose={this.handleMsgClose} severity={this.severity}>
                            {this.message}
                        </Alert>
                    </Snackbar> : ""}

                    {(this.state.showConfirmDialog === true) ?
                        <ConfirmationDialog
                        confirmDialogOpen={this.state.confirmDialogOpen}
                        handleCloseConfirm={this.handleCloseConfirm}
                        handleCloseCancel={this.handleCloseCancel}
                        handleClose={this.handleCloseCancel}
                        dialogGoal="File Deletion" /> : ''}


                    <div style={{ height: 400, width: '80%'}} >
                        <TableContainer component={Paper}>

                            <Table className={classes.table} aria-label="simple table">

                                <TableBody>

                                    {/* Row of submission status */}
                                    <TableRow >

                                        <TableCell style={{ background: colorSubmissionStatus }}> {submissionStatus} </TableCell>
                                        <TableCell component="th" scope="row">   Submission status       </TableCell>

                                    </TableRow>

                                    {/* Row of update time */}
                                    <TableRow>

                                        <TableCell >{this.state.submittedTime}</TableCell>
                                        <TableCell component="th" scope="row">   Last update time       </TableCell>

                                    </TableRow>

                                    {/* Row of update date */}
                                    <TableRow>

                                        <TableCell >{this.state.submittedDate}</TableCell>
                                        <TableCell component="th" scope="row">  Last updated  date       </TableCell>

                                    </TableRow>

                                    {/* Row of review content */}
                                    <TableRow>

                                        <TableCell > {reviewContent} </TableCell>
                                        <TableCell component="th" scope="row">   Review       </TableCell>

                                    </TableRow>

                                    {/* Row of grade description */}
                                    <TableRow>

                                        <TableCell > {gradeDesc} </TableCell>
                                        <TableCell component="th" scope="row">   Grade Description       </TableCell>

                                    </TableRow>

                                    {/* Row of submitted files */}
                                    <TableRow style = {{overflow: "hidden", whiteSpace: "unset" }} >

                                        <TableCell>

                                            <div>

                                                <DisplayFiles 
                                                FileDeletionButtonHandler = {this.deleteFileFromSubmissionHandler}
                                                role ={Role.MyFiles}
                                                files={this.state.submittedFiles} />

                                            </div>

                                        </TableCell>

                                        <TableCell component="th" scope="row">   Submitted files        </TableCell>

                                    </TableRow>

                                </TableBody>
                            </Table>

                        </TableContainer>

                        {(this.role === Role.MyFiles || this.role === Role.Commander || this.role === Role.Tester || this.role === Role.Admin) ? 
                            <div>

                                <br/>
                                
                                <Box textAlign='center'>

                                    {this.role === Role.MyFiles &&
                                    <Link to={url} style={{ textDecoration: 'none', color: "black" }}>

               
                                        <Button variant='contained' color="primary" className={classes.padding} startIcon={<PublishIcon />}>
                                            Create new Submission
                                        </Button>
                                   

                                    </Link>
                                    }
                                </Box>
                            </div>
                        : " "
                        }
                      
                        {
                            <Grid item container xs={12} justify='center' alignItems='center'>
                                <SubmissionReview
                                major={this.major}
                                module={this.module}
                                subject={this.subject}
                                soldierId={this.soldierId}
                                role={this.role}
                                history={history}
                                updateSubmissionInfo={this.getSubmissionInfo}
                                />

                            </Grid>
                        }
                    </div>

                </div>

            );
        } else {
            return (
                <h2> No Submission Was Made By You </h2>
            );
        }
    }
}



export default withStyles(useStyles, { withTheme: true })(SubmissionTableInfo)