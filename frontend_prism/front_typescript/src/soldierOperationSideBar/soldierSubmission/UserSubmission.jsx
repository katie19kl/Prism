import { Box, Breadcrumbs, Button, Grid, Typography,withStyles } from "@material-ui/core"
import React from "react"
import { purple } from "@material-ui/core/colors";
import MenuAppBar from "./../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../GeneralComponent/soldier/SoldierMenu"

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SubmissionTableInfo from "./SubmissionTableInfo";
import Role from "../../Roles/Role";
import SubmissionReview from "./submissionReview/SubmissionReview";


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



class UserSubmission extends React.Component {


    render(){

        let major = this.props.match.params.major
        let moduleName = this.props.match.params.moduleName
        let subject = this.props.match.params.subject 


        console.log("=============")
        console.log(major)
        console.log(moduleName)
        console.log(subject)
        console.log("=============")

        // classes - for styling
        const { classes } = this.props;


       const { history } = this.props;
    


        return (
 
            <MenuAppBar
            role = "Soldier" 
            menu={
                <SoldierMenu/>
            }
            content={
                
                <div>
                    
                    <Typography align="center">

                        <h2 className={classes.myFont}>
                            Your submission info 
                        </h2>
                    </Typography>

            



                    <Grid item container xs={12} justify="center" alignItems="center">
                    
 


                    
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.nav}>
                        <Typography className={classes.myFont} variant="h5" color="primary">{major}</Typography>
                        <Typography className={classes.myFont} variant="h5" color="primary">{moduleName}</Typography>
                        <Typography className={classes.myFont1} variant="h5" color="primary">{subject}</Typography>
                    </Breadcrumbs>
                    </Grid>



      
                            
                            <SubmissionTableInfo

                                browesHistory={history}
                                role={Role.MyFiles}
                                major={major}
                                module={moduleName}
                                subject={subject}
                                soldierId={"12345678"}

                            >


                            </SubmissionTableInfo>


                                        



                    



                </div>
            }
            >


            </MenuAppBar>
 
        )
    }

}

export default withStyles(useStyles, { withTheme: true })(UserSubmission);