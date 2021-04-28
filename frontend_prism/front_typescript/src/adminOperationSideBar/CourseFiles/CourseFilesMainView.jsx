import { Grid, withStyles } from "@material-ui/core";
import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getModulesByMajor } from "./files_request_handler";
import MajorSelect from "../Courses/CourseDisplaying/MajorSelect";
import FileSystemDisplay from "../Courses/CourseDisplaying/FileSystemDisplay";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    padding2: {
        flexGrow: 1,
        marginLeft: theme.spacing(36),
        marginTop: theme.spacing(7),
    },
    button: {
        marginLeft: theme.spacing(50),
        marginTop: theme.spacing(2),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 
    }
});

class CourseFilesMainView extends React.Component {

    constructor(props) {
        super(props);
        this.handleMajorChange = this.handleMajorChange.bind(this);
        this.sendGetModulesRequest = this.sendGetModulesRequest.bind(this);
        this.majors = undefined;
        this.moduleData = undefined;

        this.state = {
            updated: false,
            chosenMajor: undefined,
        };
    }

    handleMajorChange(event) {
        let eventValue = event.target.value;

        if (eventValue !== "None") {
            this.sendGetModulesRequest(eventValue);

            /*getModulesByMajor(eventValue).then(({data}) => {
                
                if (data === undefined || data === 'None' || data === null || data.length === 0) {
                    data = undefined;
                }

                // the list of modules we received from the server.
                this.moduleData = data;
                this.setState({
                    chosenMajor: eventValue
                });
            });*/

        // The user pressed the default empty option.
        } else {
            this.moduleData = undefined;
            this.setState({
                chosenMajor: undefined
            });
        }
    }

    sendGetModulesRequest(currMajor) {
        if (currMajor !== undefined) {

            getModulesByMajor(currMajor).then(({data}) => {
                
                if (data === undefined || data === 'None' || data === null || data.length === 0) {
                    data = undefined;
                }

                // the list of modules we received from the server.
                this.moduleData = data;
                this.setState({
                    chosenMajor: currMajor
                });
            });
        }
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                // Retrieve the user info.
                user = user.data;
                this.majors = user["major"];
                this.setState({
                    updated: true
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        
        if (this.state.updated) {

            return (
                <Grid container>
                    <MenuAppBar
                    menu={
                        <CommanderMenu />
                    }
                    content={
                        
                        <Grid 
                        container 
                        spacing={2} 
                        justify="flex-start" 
                        className={classes.padding}>
                            
                            <MajorSelect 
                            majors={this.majors} 
                            handleMajorChange={this.handleMajorChange}/>

                            <FileSystemDisplay 
                            chosenMajor={this.state.chosenMajor} 
                            moduleData={this.moduleData}
                            sendGetModulesRequest={this.sendGetModulesRequest} />
                            
                        </Grid>
                    }>
                    </MenuAppBar>
                </Grid>
            );
        } else {
            return (
                <MenuAppBar
                    menu={
                        <CommanderMenu />
                    }>   
                </MenuAppBar>
            );
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(CourseFilesMainView); 