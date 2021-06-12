import { Breadcrumbs, Grid, Typography,withStyles } from "@material-ui/core"
import React from "react"
import { purple, blue } from "@material-ui/core/colors";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "../../GeneralComponent/soldier/SoldierMenu"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Role from "../../Roles/Role";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import SubmissionTableInfo from '../../soldierOperationSideBar/soldierSubmission/SubmissionTableInfo';


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



class SubmissionStatusKatie extends React.Component {


    render() {
        let personalId = this.props.match.params.personalId;
        let major = this.props.match.params.major;
        let moduleName = this.props.match.params.module;
        let subject = this.props.match.params.subject;
        
        // classes - for styling
        const { classes } = this.props;
        const { history } = this.props;

        console.log("history is: ", history);

        console.log("here in submission status!!!")
    
        return (
 
            <MenuAppBar
            role={Role.Commander}
            menu={
                <CommanderMenu/>
            }
            content={
                <div>
                    <br/>
                    
                    <Grid item container xs={12} justify="center" alignItems="center">
                    
                        <Breadcrumbs 
                        separator={<NavigateNextIcon fontSize="small" />} 
                        aria-label="breadcrumb" 
                        className={classes.nav}>

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
                        role={Role.Commander}
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
        );
    }

}

export default withStyles(useStyles, { withTheme: true })(SubmissionStatusKatie);