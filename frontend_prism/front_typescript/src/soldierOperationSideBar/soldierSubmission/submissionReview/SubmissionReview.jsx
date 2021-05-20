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

        this.major = this.props.major
        this.module = this.props.module
        this.subject = this.props.subject
        this.soldierId = this.props.soldierId

        this.grade = undefined
        this.lastUpdate = undefined
        this.reviewer = undefined
        this.content = undefined

        this.numberReview = 0





        this.state =
        {
            reviews: []
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
                this.setState({ reviews: res })
            }
            console.log("!--------------!")
        })


    }


    convertNewLineToNewParagraph(text) {


        const newText = text.split('\n').map((str, index) => <p key={index}>{str}</p>);

        return newText;
    }





    render() {

        let classes = this.props.classes

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(this.state.reviews)
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&")

        let reviewContent = this.convertNewLineToNewParagraph("1- good\n2-fifty-fifty\n3-bad")
        return (
            <div style={{ height: 400, width: '80%'}} >
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">

                        <TableBody>

                            {/* Row of update time */}
                            <TableRow>

                                <TableCell >{"Time:12:23, Date: 31 of March"}</TableCell>
                                <TableCell component="th" scope="row">   Last update        </TableCell>

                            </TableRow>


                            {/* Row of review content */}
                            <TableRow>

                                <TableCell > {"almost well done "} </TableCell>
                                <TableCell component="th" scope="row">   Grade       </TableCell>

                            </TableRow>


                            {/* Row of reviewer */}
                            <TableRow>

                                <TableCell > {"123456789-Boris-Commander"} </TableCell>
                                <TableCell component="th" scope="row">   Reviewer       </TableCell>

                            </TableRow>

                            {/*Content of review*/}
                            <TableRow>

                                <TableCell > {reviewContent} </TableCell>
                                <TableCell component="th" scope="row">   Content       </TableCell>

                            </TableRow>


                        </TableBody>
                    </Table>

                </TableContainer>

                <div>

                    <Paper square elevation={0}>
                        <Typography>{"------------------------------------------1-2-3-...-10"}</Typography>
                    </Paper>

                    <br/>

                    <MobileStepper
                        steps={10}
                        position="static"
                        variant="text"
                        activeStep={this.numberReview}
                        nextButton={
                            <Button size="small">
                                Next
                              <KeyboardArrowRight />

                            </Button>
                        }
                        backButton={
                            <Button size="small" >
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