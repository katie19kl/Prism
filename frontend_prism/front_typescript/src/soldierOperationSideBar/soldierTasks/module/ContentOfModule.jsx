import { Breadcrumbs, Button, Grid, Typography, withStyles } from "@material-ui/core";
import React from "react"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DisplaySubjectContent from "../../soldierTasks/subject/DisplaySubjectContent";
import { purple } from "@material-ui/core/colors";
import { Link } from "react-router-dom";


const useStyles = (theme) => ({

    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
    myFont1: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        color: purple[400],
    },
    nav: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(10),
    },
    title: {
        margin: theme.spacing(4, 0, 2),
        fontFamily: "monospace",
    },
});


class ContentOfModule extends React.Component {


    render() {

        const { classes } = this.props;
        let moduleName = this.props.moduleName;
        let major = this.props.major;
        let subjects = this.props.subjects;
        console.log("-------")
        console.log(subjects)
        console.log("-------")


        let personalId = this.props.personalId;

        let dictSubjectFiles = this.props.dictSubjectFiles
 
        let postfix_param = major + "/" + moduleName + "/"


        return (
 
            <div>
                <Grid item container xs={12} justify="center" alignItems="center">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.nav}>
                    <Typography className={classes.myFont1} variant="h5" color="primary">{major}</Typography>
                    <Typography className={classes.myFont} variant="h5" color="primary">{moduleName}</Typography>
                </Breadcrumbs>
                </Grid>
                <ul className="list-group list-group-flush">
        
                {subjects !== undefined && subjects.map((subject,index) => (

                    <li className="list-group-item" key={index}  >
                        
                        <h3 className={classes.title}><b>{subject} </b></h3>

                        <i className={classes}> 
                            <div>
                                <DisplaySubjectContent
                                subject = {subject}
                                dictSubjectFiles = {dictSubjectFiles}
                                major = {major}
                                moduleName={moduleName}
                                personalId={personalId}
                                >
                                </DisplaySubjectContent>

                            </div>  
                        </i>

                        <br/>

                        <Link to={"/submission/info/" + postfix_param + subject + "/" + personalId }>
                            <Button variant="contained" color="primary" size="medium" >
                                Submission Info
                            </Button>
                        </Link>

                    </li>
                    ))
                } 
                </ul>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(ContentOfModule)