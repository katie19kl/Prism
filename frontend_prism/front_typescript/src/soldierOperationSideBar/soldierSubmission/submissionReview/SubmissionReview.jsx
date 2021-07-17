import React from "react"
import Paper from '@material-ui/core/Paper';
import { deleteReview, getReviews, updateReview, Action } from './review_handler'
import Role from "../../../Roles/Role";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import UpdateIcon from '@material-ui/icons/Update';
import MuiAlert from '@material-ui/lab/Alert';
import PublishIcon from '@material-ui/icons/Publish';
import { Button, Snackbar, Grid, MobileStepper, Table, TableBody, TableCell,
    TableContainer, TableRow, withStyles, Box } from "@material-ui/core";
import ReviewCreationDialog from "../../../GeneralComponent/dialogs/ReviewCreationDialog";
import { isNumeric } from "../../../HelperJS/validator";
import { sendCreateReviewRequest } from "../submission_handling";
import ReviewUpdateDialog from "../../../GeneralComponent/dialogs/ReviewUpdateDialog";


const useStyles = (theme) => ({
    table: {
        minWidth: 400,
        border: '3px solid #adebeb'
    },
    padding: {
        marginLeft: theme.spacing(3)
    }
});


/* shows the alert msg when an action attempt is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class SubmissionReview extends React.Component {

    constructor(props) {
        super(props)
        this.nextClick = this.nextClick.bind(this);
        this.prevClick = this.prevClick.bind(this);
        this.deleteOnClick = this.deleteOnClick.bind(this);
        this.updateOnClick = this.updateOnClick.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);
        //this.showReviews = this.props.showReviews;
        this.handleCloseCreate = this.handleCloseCreate.bind(this);
        this.setErrorMsg = this.setErrorMsg.bind(this);
        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.commentOnChange = this.commentOnChange.bind(this);
        this.gradeOnChange = this.gradeOnChange.bind(this);
        this.handleChangeGradeDesc = this.handleChangeGradeDesc.bind(this);
        this.setShowTo = this.setShowTo.bind(this);
        this.createReview = this.createReview.bind(this);
        this.updateViewAfterAction = this.updateViewAfterAction.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
        this.handleCloseCancelUpdate = this.handleCloseCancelUpdate.bind(this);
        this.updateSubmissionInfo = this.props.updateSubmissionInfo;

        this.major = this.props.major;
        this.module = this.props.module;
        this.subject = this.props.subject;
        this.soldierId = this.props.soldierId;
        this.role = this.props.role;
        this.msg = undefined;
        this.severity = undefined;
        this.showTo = undefined; // used for creation

        this.state = {
            reviews: [],
            amountRevs: -1,
            currentNumberReview: 0,
            showMsg: false,
            msgOpen: false,
            reviewDialogOpen: false,
            showReviewDialog: false,

            gradeDesc: undefined, // creation
            reviewComment: "", // creation
            grade: '', // creation

            updateDialogOpen: false,
            showUpdateDialog: false,
        };
    }

    /* get all reviews according to the current user's role. */
    async getAllForMe(major, module, subject, soldierId) {

        return await getReviews(soldierId, major, module, subject).then((res) => {

            // the response is either undefined or the list of
            // reviews according to the current user's role.
            if (res === undefined) {
                return undefined;
            
            } else {
                return res;
            } 
        });
    }

    componentDidMount() {
        let major = this.major;
        let module = this.module;
        let subject = this.subject;
        let soldierId = this.soldierId;

        this.getAllForMe(major, module, subject, soldierId).then((res) => {
            if (res !== undefined) {
                this.setState({ reviews: res, amountRevs: res.length })
            }
        });
    }

    convertNewLineToNewParagraph(text) {
        const newText = text.split('\n').map((str, index) => <p key={index}>{str}</p>);

        return newText;
    }

    retrieveDataOfCurrentReview() {
        
        let currentIndexReview = this.state.currentNumberReview;
        let currReviewToDisplay = this.state.reviews[currentIndexReview];

        if (currReviewToDisplay === undefined) {
            return undefined;
        }

        return { 
            comment : currReviewToDisplay.comment,
            grade : currReviewToDisplay.grade,
            checkerId : currReviewToDisplay.checkerId,
            checkerRole: currReviewToDisplay.checkerRole,
            date : currReviewToDisplay.submittedDate,
            time : currReviewToDisplay.submittedTime,
            gradeDescription: currReviewToDisplay.gradeDescription,
            showTo: currReviewToDisplay.showTo
        };
    }

    nextClick() {
  
        let prevIndexRev = this.state.currentNumberReview;
        this.setState({ currentNumberReview : prevIndexRev + 1 });
    }

    prevClick() {

        let prevIndexRev = this.state.currentNumberReview;
        this.setState({ currentNumberReview : prevIndexRev - 1 });
    }

    handleMsgClose() {
        this.msg = undefined;
        this.severity = undefined;
        this.setState({ msgOpen: false, showMsg: false });
    }

    // update the view after creating/updating/deleting reviews.
    updateViewAfterAction(action) {

        this.getAllForMe(this.major, this.module, this.subject, this.soldierId)
        .then((res) => {
            if (res !== undefined) {
                let index;

                if (action === Action.Delete) {
                    // update the stepper's index.
                    if (res.length > 0) {
                        index = res.length - 1;
                    } else if (res.length <= 0) {
                        index = 0;
                    }
                    this.setState({ 
                        reviews: res, amountRevs: res.length,
                        currentNumberReview: index 
                    });

                } else if (action === Action.Create) {
                    this.setState({ reviews: res, amountRevs: res.length, });

                } else if (action === Action.Update) {
                    this.setState({ reviews: res, amountRevs: res.length, });
                }
            }
        });
    }

    deleteOnClick() {

        let currReview = this.retrieveDataOfCurrentReview();

        if (currReview !== undefined) {
            deleteReview(this.soldierId, this.major, this.module, this.subject, 
                currReview.date, currReview.time, currReview.checkerId, 
                currReview.checkerRole).then((res) => {

                if (res !== undefined) {
                    
                    if (res.data !== undefined) {
                        this.msg = "The review was deleted successfully";
                        this.severity = 'success';
                    } else {
                        this.setErrorMsg(Action.Delete);
                    }
                } else {
                    this.setErrorMsg(Action.Delete);
                }

                // update the view after deletion.
                this.updateViewAfterAction(Action.Delete);
                this.updateSubmissionInfo();

                this.setState({ msgOpen: true, showMsg: true });
            });
        } else {
            this.setErrorMsg(Action.Delete);
            this.setState({ msgOpen: true, showMsg: true });
        }
    }

    updateOnClick() {
        this.setState({ showUpdateDialog: true, updateDialogOpen: true });
    }

    handleCloseUpdate() {
        let currReview = this.retrieveDataOfCurrentReview();

        if (currReview !== undefined) {
            updateReview(this.soldierId, this.major, this.module, this.subject, 
                currReview.date, currReview.time, currReview.checkerId, this.state.grade,
                this.state.gradeDesc, this.state.reviewComment, this.showTo).then((res) => {

                if (res === undefined || res === false) {
                    this.setErrorMsg(Action.Update);
                    
                } else if (res.data !== undefined) {

                    if (res.status !== undefined && res.status === 200) {
                        this.msg = 'Updated the review successfully';
                        this.severity = 'success';

                        // update the view after finishing.
                        this.updateViewAfterAction(Action.Update);
                        this.updateSubmissionInfo();
                    } else {
                        this.setErrorMsg(Action.Update);
                    }
                    
                } else if (res === '') {
                    this.severity = 'error';
                    this.msg = 'There are no changes made to the data';
                }

                // nullify:
                this.showTo = undefined;
                this.setState({
                    gradeDesc: undefined, reviewComment: '', grade: '',
                    showMsg: true, msgOpen: true, updateDialogOpen: false,
                    showUpdateDialog: false,
                });
            });

        } else {
            this.setErrorMsg(Action.Update);

            // nullify:
            this.showTo = undefined;
            this.setState({
                gradeDesc: undefined, reviewComment: '', grade: '',
                showMsg: true, msgOpen: true, updateDialogOpen: false,
                showUpdateDialog: false,
            });
        }
    }

    handleCloseCancelUpdate() {

        // nullify:
        this.showTo = undefined;
        this.setState({ 
            showUpdateDialog: false, updateDialogOpen: false,
            gradeDesc: undefined, reviewComment: '', grade: ''
        });
    }

    createReview() {
        this.setState({ showReviewDialog: true, reviewDialogOpen: true });
    }

    handleCloseCreate() {

        // set the grade var before sending the req. to the server.
        let finalGrade = '';
        if (!isNumeric(this.state.grade)) {
            finalGrade = undefined;
        } else {
            finalGrade = this.state.grade;
        }

        // send post request to the server.
        sendCreateReviewRequest(
            this.soldierId, this.major, this.module,
            this.subject, this.state.reviewComment, 
            finalGrade, this.state.gradeDesc, this.showTo).then((response) => {

            if (response === undefined) {
                this.setErrorMsg(Action.Create);

            } else if (response.data !== undefined) {

                if (response.status === 201) {
                    this.msg = "Review created successfully!";
                    this.severity = "success";

                    // update the view to see the new review.
                    this.updateViewAfterAction(Action.Create);
                    this.updateSubmissionInfo();
                    
                } else {
                    this.setErrorMsg(Action.Create);
                }
            } else {
                this.setErrorMsg(Action.Create);
            }

            // nullify:
            this.showTo = undefined;
            this.setState({
                showReviewDialog: false, reviewDialogOpen: false,
                showMsg: true, msgOpen: true, gradeDesc: undefined,
                reviewComment: '', grade: ''
            });
        });
    }

    setErrorMsg(action) {
        this.msg = "Failed to " + action + " the review";
        this.severity = "error";
    }

    handleCloseCancel() {
        // nullify.
        this.showTo = undefined;

        this.setState({
            showReviewDialog: false, reviewDialogOpen: false,
            gradeDesc: undefined, reviewComment: '', grade: ''
        });
    }

    commentOnChange(event) {
        this.setState({ reviewComment: event.target.value });
    }

    gradeOnChange(value) {
        this.setState({ grade: value });
    }

    handleChangeGradeDesc(event) {
        let value = event.target.value;
        this.setState({ gradeDesc: value });
    }

    setShowTo(value) {
        this.showTo = value;
    }

    render() {
        let classes = this.props.classes;
        let history = this.props.history;
        let currIndex = this.state.currentNumberReview;        
        let dataReview = this.retrieveDataOfCurrentReview();

        let comment;
        let grade;
        let checkerId;
        let checkerRole;
        let date;
        let time;
        let gradeDescription;
        let showToArray;
        let originalComment;


        if (dataReview !== undefined) {
            comment = dataReview.comment;
            grade = dataReview.grade;
            checkerId = dataReview.checkerId;
            checkerRole = dataReview.checkerRole;
            time = dataReview.time;
            date = dataReview.date;
            gradeDescription = dataReview.gradeDescription;
            showToArray = dataReview.showTo;
        }

        if (comment !== undefined) {

            // save the original comment.
            originalComment = comment;

            // convert to <p> according to '\n':
            comment = this.convertNewLineToNewParagraph(comment);
        }
        
        return (
            <div style={{ height: 400, width: '80%'}} >

                {(this.state.showMsg === true) ? 
                    <Snackbar open={this.state.msgOpen} 
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    onClose={this.handleMsgClose}>
                        <Alert onClose={this.handleMsgClose} severity={this.severity}>
                            {this.msg}
                        </Alert>
                    </Snackbar> : ""}

                {(this.state.showReviewDialog === true) ? 
                    <ReviewCreationDialog 
                    reviewDialogOpen={this.state.reviewDialogOpen}
                    handleCloseCreate={this.handleCloseCreate}
                    handleCloseCancel={this.handleCloseCancel}
                    handleClose={this.handleCloseCancel}
                    commentOnChange={this.commentOnChange}
                    gradeOnChange={this.gradeOnChange}
                    handleChangeGradeDesc={this.handleChangeGradeDesc}
                    gradeDesc={this.state.gradeDesc}
                    reviewComment={this.state.reviewComment}
                    setShowTo={this.setShowTo}
                    /> : ''}

                {(this.state.showUpdateDialog === true) ?
                <ReviewUpdateDialog
                reviewDialogOpen={this.state.updateDialogOpen}
                handleCloseUpdate={this.handleCloseUpdate}
                handleCloseCancel={this.handleCloseCancelUpdate}
                commentOnChange={this.commentOnChange}
                gradeOnChange={this.gradeOnChange}
                handleChangeGradeDesc={this.handleChangeGradeDesc}
                setShowTo={this.setShowTo}
                gradeDesc={gradeDescription}
                reviewComment={originalComment}
                grade={grade}
                showTo={showToArray}
                /> : ''}

                {/*(this.role === Role.MyFiles || this.role === Role.Commander || this.role === Role.Tester)*/ (this.role !== Role.Soldier) ? 
                    <div>
                        <br/>

                        <Box textAlign='center'>

                            <Button variant='contained' color="primary" style={{backgroundColor: "red"}}
                            onClick={() => history.goBack()}>
                                    GO BACK
                            </Button>

                            {(this.role === Role.Commander || this.role === Role.Tester || this.role === Role.Admin) &&
                                <Button 
                                variant='contained' 
                                color="primary" 
                                className={classes.padding} 
                                startIcon={<PublishIcon />}
                                onClick={this.createReview}>
                                    Create new Review
                                </Button>
                            }
                        </Box>

                        <br/>
                        <br/>

                    </div>
                : " "
                }
                
                {(this.state.amountRevs > 0) ? 
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">

                            <TableBody>

                                {/* Row of update time */}
                                <TableRow>

                                    <TableCell >{date + " " + time }</TableCell>
                                    <TableCell component="th" scope="row">   Last Update        </TableCell>

                                </TableRow>


                                {/* Row of review content */}
                                <TableRow>

                                    <TableCell > {grade} </TableCell>
                                    <TableCell component="th" scope="row">   Grade       </TableCell>

                                </TableRow>


                                {/* Row of reviewer */}
                                <TableRow>

                                    <TableCell > {checkerId + " - " + checkerRole} </TableCell>
                                    <TableCell component="th" scope="row">   Reviewer       </TableCell>

                                </TableRow>

                                {/*Content of review*/}
                                <TableRow>

                                    <TableCell > {comment} </TableCell>
                                    <TableCell component="th" scope="row">   Comment       </TableCell>

                                </TableRow>

                                {/* Delete and update buttons*/}
                                {(this.role !== undefined && this.role !== Role.Soldier 
                                    && this.role !== Role.MyFiles) ? 
                                <TableRow>

                                    <TableCell>
                                        <Grid 
                                        container 
                                        item 
                                        justify='flex-start' 
                                        alignItems='flex-start' 
                                        xs={12}>
                                            
                                            <Button 
                                            variant='contained' 
                                            color="primary" 
                                            startIcon={<UpdateIcon />}
                                            onClick={this.updateOnClick}
                                            >
                                                Update Review
                                            </Button>

                                        </Grid>

                                    </TableCell>

                                    <TableCell>

                                        <Grid 
                                        container 
                                        item 
                                        justify='flex-start' 
                                        alignItems='flex-start' 
                                        xs={12}>

                                            <Button 
                                            variant='contained' 
                                            color="primary" 
                                            onClick={this.deleteOnClick}
                                            style={{backgroundColor: "red"}}>
                                                Delete
                                            </Button>

                                        </Grid>

                                    </TableCell>

                                </TableRow>
                                : ''}

                            </TableBody>

                        </Table>

                    </TableContainer>
                : ''}

                {(this.state.amountRevs > 0) ? 
                    <div>
                        <MobileStepper
                            steps={this.state.amountRevs}
                            position="static"
                            variant="text"
                            activeStep={currIndex}
                            nextButton={

                                <Button size="small" onClick={this.nextClick} disabled={currIndex === this.state.amountRevs - 1}>
                                    Next
                                <KeyboardArrowRight />
                                </Button>
                            }

                            backButton={
                                <Button size="small" onClick={this.prevClick} disabled={currIndex === 0} >
                                    <KeyboardArrowLeft />
                                    Back
                                </Button>
                            }
                        />
                        <br/>
                        <br/>
                    </div>
                : '' }
            </div>
        );
    }
}



export default withStyles(useStyles, { withTheme: true })(SubmissionReview)