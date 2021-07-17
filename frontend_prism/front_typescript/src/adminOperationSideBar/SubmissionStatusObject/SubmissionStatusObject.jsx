import { Breadcrumbs, Grid, Typography,withStyles } from "@material-ui/core"
import React from "react"
import { purple, blue } from "@material-ui/core/colors";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Role from "../../Roles/Role";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import SubmissionTableInfo from '../../soldierOperationSideBar/soldierSubmission/SubmissionTableInfo';
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";
import TesterMenu from "../../GeneralComponent/tester/TesterMenu";


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



class SubmissionStatusObject extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            myRole: undefined
        };
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                // Retrieve the user info.
                user = user.data;
                if (user !== undefined) {

                    let role = user["role"];

                    this.setState({ myRole: role });
                }
            }
        });
    }


    render() {
        let personalId = this.props.match.params.personalId;
        let major = this.props.match.params.major;
        let moduleName = this.props.match.params.module;
        let subject = this.props.match.params.subject;
        
        // classes - for styling
        const { classes } = this.props;
        const { history } = this.props;

        if (this.state.myRole === undefined) {

            return <WaiterLoading />;

        } else {

            let currMenu = undefined;

            if (this.state.myRole === Role.Commander || this.state.myRole === Role.Admin) {
                currMenu = <CommanderMenu />;
            
            } else if (this.state.myRole === Role.Tester) {
                currMenu = <TesterMenu />;
            }

            return (
 
                <MenuAppBar
                role={this.state.myRole}
                menu={currMenu}
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
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
    
                        <br/>
                        <br/>
                                
                        <SubmissionTableInfo
    
                            browesHistory={history}
                            role={this.state.myRole}
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

}

export default withStyles(useStyles, { withTheme: true })(SubmissionStatusObject);