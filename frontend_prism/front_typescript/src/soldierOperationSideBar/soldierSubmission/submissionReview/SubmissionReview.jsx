import React from "react"
import { Button, MobileStepper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, withStyles } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import { getAllReviewsForSoldier } from './review_handler'
import Role from "../../../Roles/Role";

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = (theme) => ({
    table: {
        minWidth: 400,
    },
});



class SubmissionReview extends React.Component {


    constructor(props) {
        super(props)

        this.nextClick = this.nextClick.bind(this)
        this.prevClick = this.prevClick.bind(this) 

        

        this.major = this.props.major
        this.module = this.props.module
        this.subject = this.props.subject
        this.soldierId = this.props.soldierId

        this.grade = undefined
        this.lastUpdate = undefined
        this.reviewer = undefined
        this.content = undefined

        




        this.state =
        {
            reviews: [],
            amountRevs: -1,
            currentNumberReview : 0,
        }



    }


    async getAllForMe(major, module, subject, soldierId) {

        return await getAllReviewsForSoldier(major, module, subject, soldierId).then((result) => {

            if (result === undefined) {
                return "XUI"
            }
            else {
                let allowedReviews = []
                let arrData = result.data
                console.log("=================")
                console.log(arrData)
                console.log("=================")

                for (let rev of arrData) {
                    if (rev.showTo.indexOf(Role.Soldier) !== -1) {
                        console.log("can show --=-=-")
                        console.log(rev)
                        allowedReviews.push(rev)

                    }
                }
                return allowedReviews

            }
        })


    }


    componentDidMount() {
        let major = this.major
        let module = this.module
        let subject = this.subject
        let soldierId = this.soldierId

        this.getAllForMe(major, module, subject, soldierId).then((res) => {
            console.log("!--------------!")
            console.log(res)
            if (res !== undefined) {
                this.setState({ reviews: res, amountRevs: res.length })
            }
            console.log("!--------------!")
        })


    }


    convertNewLineToNewParagraph(text) {


        const newText = text.split('\n').map((str, index) => <p key={index}>{str}</p>);

        return newText;
    }

    retrieveDataOfCurrentReview()
    {
        
        let currentIndexReview = this.state.currentNumberReview
        
        let currReviewToDisplay = this.state.reviews[currentIndexReview]

        if (currReviewToDisplay === undefined){
            return undefined
        }
        return { comment : currReviewToDisplay.comment,
                 grade : currReviewToDisplay.grade,
                 checkerId : currReviewToDisplay.checkerId,
                 checkerRole: currReviewToDisplay.checkerRole,
                 time : currReviewToDisplay.submittedTimeStamp

        }


    
    }
    nextClick(){
        console.log("NEXT")
        let prevIndexRev = this.state.currentNumberReview
        this.setState({currentNumberReview : prevIndexRev + 1})
        
    }
    prevClick(){
        console.log("PREV")
        let prevIndexRev = this.state.currentNumberReview
        this.setState({currentNumberReview : prevIndexRev - 1})
        
    }


    render() {

        let classes = this.props.classes

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&")
        //console.log(this.state.reviews)
        let currIndex = this.state.currentNumberReview
        console.log(this.state.currentNumberReview)
        
        let dataReview = this.retrieveDataOfCurrentReview()
        console.log(dataReview)

        let comment
        let grade
        let checkerId
        let checkerRole
        let time

        if (dataReview !== undefined){
            comment = dataReview.comment
            grade = dataReview.grade
            checkerId = dataReview.checkerId
            checkerRole = dataReview.checkerRole
            time = dataReview.time
            console.log(comment)
            console.log(grade)
            console.log(checkerId)
            console.log(checkerRole)
            console.log(time)
        }

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&")

        //let reviewContent = this.convertNewLineToNewParagraph("1- good\n2-fifty-fifty\n3-Xuinia")
        
        return (
            <div style={{ height: 400, width: '80%'}} >
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">

                        <TableBody>

                            {/* Row of update time */}
                            <TableRow>

                                <TableCell >{time}</TableCell>
                                <TableCell component="th" scope="row">   Last update        </TableCell>

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