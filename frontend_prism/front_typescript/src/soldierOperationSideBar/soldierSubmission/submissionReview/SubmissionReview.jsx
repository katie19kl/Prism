import React from "react"
import Paper from '@material-ui/core/Paper';
import { getAllReviewsByRole, deleteReview, getReviews } from './review_handler'
import Role from "../../../Roles/Role";
import { getUserInfoByJWT } from '../../../HelperJS/extract_info';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import UpdateIcon from '@material-ui/icons/Update';
import MuiAlert from '@material-ui/lab/Alert';
import { Button, Snackbar, Grid, MobileStepper, Table, TableBody, TableCell,
    TableContainer, TableRow, withStyles } from "@material-ui/core";


const useStyles = (theme) => ({
    table: {
        minWidth: 400,
    },
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
        this.showReviews = this.props.showReviews;

        this.major = this.props.major;
        this.module = this.props.module;
        this.subject = this.props.subject;
        this.soldierId = this.props.soldierId;
        this.role = this.props.role;
        this.grade = undefined;
        this.lastUpdate = undefined;
        this.reviewer = undefined;
        this.content = undefined;
        this.msg = undefined;
        this.severity = undefined;

        this.state = {
            reviews: [],
            amountRevs: -1,
            currentNumberReview: 0,
            showMsg: false,
            msgOpen: false,
        };
    }

    /* get all reviews according to the current user's role. */
    async getAllForMe(major, module, subject, soldierId) {

        return await getReviews(soldierId, major, module, subject).then((res) => {

            // the response is either undefined or the list of
            // reviews according to the current user's role.
            if (res == undefined) {
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
            time : currReviewToDisplay.submittedTime
        };
    }

    nextClick() {
        console.log("NEXT")
        let prevIndexRev = this.state.currentNumberReview;
        this.setState({ currentNumberReview : prevIndexRev + 1 });
    }

    prevClick() {
        console.log("PREV")
        let prevIndexRev = this.state.currentNumberReview;
        this.setState({ currentNumberReview : prevIndexRev - 1 });
    }

    handleMsgClose() {
        this.msg = undefined;
        this.severity = undefined;
        this.setState({ msgOpen: false, showMsg: false });
    }

    deleteOnClick() {

        let currReview = this.retrieveDataOfCurrentReview();

        if (currReview !== undefined) {
            deleteReview(this.soldierId, this.major, this.module, this.subject, currReview.date, 
                currReview.time, currReview.checkerId, currReview.checkerRole).then((res) => {

                if (res !== undefined) {
                    
                    if (res.data !== undefined) {
                        this.msg = "The review was deleted successfully";
                        this.severity = 'success';
                    } else {
                        this.msg = "Failed to delete the review";
                        this.severity = 'error';
                    }
                } else {
                    this.msg = "Failed to delete the review";
                    this.severity = 'error';
                }

                // update the view after deletion.
                this.getAllForMe(this.major, this.module, this.subject, this.soldierId).then((res) => {
                    if (res !== undefined) {
                        let index;

                        // update the stepper's index.
                        if (res.length > 0) {
                            index = res.length - 1;
                        } else if (res.length <= 0) {
                            index = 0;
                        }
                        this.setState({ reviews: res, amountRevs: res.length, currentNumberReview: index });
                    }
                });

                this.setState({ msgOpen: true, showMsg: true });
            });
        }
    }

    updateOnClick() {

    }

    render() {
        let classes = this.props.classes;

        let currIndex = this.state.currentNumberReview;
        console.log(this.state.currentNumberReview);
        
        let dataReview = this.retrieveDataOfCurrentReview();
        console.log(dataReview)

        let comment;
        let grade;
        let checkerId;
        let checkerRole;
        let date;
        let time;

        if (dataReview !== undefined) {
            comment = dataReview.comment;
            grade = dataReview.grade;
            checkerId = dataReview.checkerId;
            checkerRole = dataReview.checkerRole;
            time = dataReview.time;
            date = dataReview.date;
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

                                <TableCell > {checkerId + " |-| " + checkerRole} </TableCell>
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
                            <Button size="small"  onClick={this.prevClick} disabled={currIndex === 0} >
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }
}



export default withStyles(useStyles, { withTheme: true })(SubmissionReview)