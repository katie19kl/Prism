import { Breadcrumbs, Grid, Typography, withStyles } from "@material-ui/core";
import React from "react"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DisplaySubjectContent from "../../soldierTasks/subject/DisplaySubjectContent";
import { purple } from "@material-ui/core/colors";


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
    }
});

class ContentOfModule extends React.Component {


    render() {

        const { classes } = this.props;
        console.log("-----content of module---------")
        

        let moduleName = this.props.moduleName;
        let major = this.props.major;
        let subjects = this.props.subjects;

        let dictSubjectFiles = this.props.dictSubjectFiles
        console.log(Object.keys(dictSubjectFiles))


        let postfix_param = major + "/" + moduleName + "/"
        console.log(postfix_param)

        return (
 
            <div>
                <Grid item container xs={12} justify="center" alignItems="center">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.nav}>
                    <Typography className={classes.myFont1} variant="h5" color="primary">{major}</Typography>
                    <Typography className={classes.myFont} variant="h5" color="primary">{moduleName}</Typography>
                </Breadcrumbs>
                </Grid>
                <ul className="list-group list-group-flush">
        
                {subjects !== undefined && subjects.map((subject,index)=>(

            
                    <li className="list-group-item" key={index}  >
                        

                        <h6>{subject} </h6>

                        <i className={classes}> 
                            <div>
                                <DisplaySubjectContent
                                subject = {subject}
                                dictSubjectFiles = {dictSubjectFiles}
                                major = {major}
                                moduleName={moduleName}
                                >
                                </DisplaySubjectContent>
                            </div>  
                        </i>
                        <a href={"/submission/info/" + postfix_param + subject}> Submission info of subject </a>
                    </li>
                    ))
                } 
                </ul>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(ContentOfModule)