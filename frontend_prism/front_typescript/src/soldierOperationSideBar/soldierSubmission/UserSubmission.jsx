import { Breadcrumbs, Grid, Typography,withStyles } from "@material-ui/core"
import React from "react"
import { blue, purple } from "@material-ui/core/colors";
import MenuAppBar from "./../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../GeneralComponent/soldier/SoldierMenu"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SubmissionTableInfo from "./SubmissionTableInfo";
import Role from "../../Roles/Role";


const useStyles = (theme) => ({

    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
    myFont1: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        color: purple[400],
    },
    myFont2: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        color: blue[300],
    },
    nav: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(10),
    },
    title: {
        marginRight: theme.spacing(8),
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },

});


class UserSubmission extends React.Component {


    render() {

        let major = this.props.match.params.major;
        let moduleName = this.props.match.params.moduleName;
        let subject = this.props.match.params.subject;
        let personalId = this.props.match.params.personalId;

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
                    
                    <br/>

                    <Grid item container xs={12} justify="center" alignItems="center">
                    
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.nav}>
                            <Typography 
                            className={classes.myFont} 
                            variant="h5" 
                            color="primary">
                                {major}
                            </Typography>
                            <Typography 
                            className={classes.myFont2} 
                            variant="h5" 
                            color="primary">
                                {moduleName}
                            </Typography>
                            <Typography 
                            className={classes.myFont1} 
                            variant="h5" 
                            color="primary">
                                {subject}
                            </Typography>
                        </Breadcrumbs>
                    </Grid>

                    <br/>
                    <br/>
                            
                    <SubmissionTableInfo

                        browesHistory={history}
                        role={Role.MyFiles}
                        major={major}
                        module={moduleName}
                        subject={subject}
                        soldierId={personalId}

                    >
                    </SubmissionTableInfo>
                </div>
            }
            >
            </MenuAppBar>
        );
    }

}

export default withStyles(useStyles, { withTheme: true })(UserSubmission);