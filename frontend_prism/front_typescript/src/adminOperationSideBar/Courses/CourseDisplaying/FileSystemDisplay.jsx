import { List, Accordion, withStyles, Grid, Typography, Button, Snackbar, IconButton } from "@material-ui/core";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react"
import { getSubjectsByModule, getFilesBySubject,
         deleteModuleByMajor, deleteSubjectByModule } from "../../CourseFiles/files_request_handler";
import DisplayFiles from "./DisplayFiles";
import ConfirmationDialog from "../../Users/DeleteUser/ConfirmationDialog";
import MuiAlert from '@material-ui/lab/Alert';


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
        float: "right",
        marginLeft: theme.spacing(10),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 
    }
});


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class FileSystemDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.handleAccordionChange = this.handleAccordionChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.moduleDeletionButtonHandler = this.moduleDeletionButtonHandler.bind(this);
        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.handleCloseConfirmModule = this.handleCloseConfirmModule.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);
        this.objectDeletionHandling = this.objectDeletionHandling.bind(this);
        this.handleDeletionResponse = this.handleDeletionResponse.bind(this);
        this.handleCloseConfirmSubject = this.handleCloseConfirmSubject.bind(this);
        this.handleGetSubjectRequest = this.handleGetSubjectRequest.bind(this);
        this.handleGetFilesRequest = this.handleGetFilesRequest.bind(this);
        this.sendGetModulesRequest = this.props.sendGetModulesRequest;
        this.subjectsData = undefined;
        this.filesData = undefined;

        // used when sending the deletion req. to the server.
        this.moduleToDelete = undefined;
        this.subjectToDelete = undefined;
        this.fileToDelete = undefined;

        // showing informative msgs when the users is deleting module/subject.
        this.msg = undefined;
        this.severity = undefined;

        this.state = {
            expanded: false,
            expandedSubject: false,

            chosenMajor: this.props.chosenMajor,
            chosenModule: undefined,
            chosenSubject: undefined,

            moduleUpdate: false,
            filesUpdate: false,
            moduleData: this.props.moduleData,

            showConfirmDialogModule: false,
            showConfirmDialogSubject: false,
            showConfirmDialogFile: false,
            confirmDialogOpenModule: false,
            confirmDialogOpenSubject: false,
            confirmDialogOpenFile: false,

            // for informative msgs.
            showMsg: false,
            msgOpen: false,

        };
    }

    /* handles opening of a module accordion. */
    handleAccordionChange = (panel) => (_event, isExpanded) => {

        if (isExpanded) {
            this.setState({
                expanded: panel,
                expandedSubject: false
            });
        } else {
            this.setState({
                expanded: false
            });
        }

        let moduleName = panel;

        console.log("major: " + this.state.chosenMajor + ", module: " + moduleName);

        if (moduleName !== undefined && moduleName !== null && moduleName !== 'None') {

            this.handleGetSubjectRequest(moduleName);
        }
    }

    /* 
    helper function for handleAccordionChange- calls 
    the getSubjectsByModule function and re-renders view.
     */
    handleGetSubjectRequest(moduleName) {
        getSubjectsByModule(this.state.chosenMajor, moduleName).then(({data}) => {

            if (data === undefined || data === 'None' || data === null || data.length === 0) {
                data = undefined;
            }

            this.subjectsData = data;

            this.setState({
                moduleUpdate: true,
                chosenModule: moduleName,
            });
        });
    } 

    /* handles opening of a subject accordion. */
    handleSubjectChange = (panel) => (_event, isExpanded) => {

        if (isExpanded) {
            this.setState({
                expandedSubject: panel
            });
        } else {
            this.setState({
                expandedSubject: false
            });
        }
        let subjectName = panel;

        if (subjectName !== undefined && subjectName !== null && subjectName !== 'None') {
            this.handleGetFilesRequest(subjectName);
        }
    }

    /* 
    helper function for handleSubjectChange- calls 
    the getFilesBySubject function and re-renders view.
     */
    handleGetFilesRequest(subjectName) {

        getFilesBySubject(this.state.chosenMajor, this.state.chosenModule, subjectName)
        .then(({data}) => {

            if (data === undefined || data === 'None' || data === null || data.length === 0) {
                data = undefined;
            }

            this.filesData = data;

            this.setState({
                filesUpdate: true,
                chosenSubject: subjectName
            });
        });
    }

    componentDidUpdate() {
        if (this.props.chosenMajor !== this.state.chosenMajor) {
            this.setState({ chosenMajor: this.props.chosenMajor });
        }

        if (this.props.moduleData !== this.state.moduleData) {
            this.setState({ moduleData: this.props.moduleData })
        }
    }

    /* takes care of sending the deletion request of an obj to the server */
    objectDeletionHandling(serverRequestFunc, objToDelete) {
            
        let isValid = false;
        let listParams = undefined;

        if (objToDelete === 'module') {
            if (this.moduleToDelete !== undefined) {
                isValid = true;
                listParams = [this.state.chosenMajor, this.moduleToDelete];
            }
        
        } else if (objToDelete === 'subject') {
            if (this.subjectToDelete !== undefined) {
                isValid = true;
                listParams = [this.state.chosenMajor, this.state.chosenModule,
                                this.subjectToDelete];
            }

        } else if (objToDelete === 'file') {
            if (this.fileToDelete !== undefined) {
                isValid = true;
                listParams = [this.state.chosenMajor, this.state.chosenModule,
                                this.state.chosenSubject, this.fileToDelete];
            }
        } else {
            return undefined; // error.
        }

        if (isValid) {
            serverRequestFunc(listParams).then((response) => {
                this.handleDeletionResponse(response, objToDelete);

                // update the view to be without the deleted module.
                this.sendGetModulesRequest(this.state.chosenMajor);

                if (objToDelete === 'subject') {

                    // update the view to be without the deleted subject.
                    if (this.state.chosenModule !== undefined) {
                        this.handleGetSubjectRequest(this.state.chosenModule);
                    }

                } else if (objToDelete === 'file') {
                    console.log("re render the view to be without the deleted file");
                }
            });

        } else {
            console.log("I am here in else when the data is not valid");
            return undefined;
        }
    }

    /* activates the informative msg depending on the server's response. */
    handleDeletionResponse(response, objToDelete) {
        if (response !== undefined) {

            if (response.status === 200) {
                console.log('success');
                this.msg = objToDelete + " deleted successfully";
                this.severity = "success";
                this.setState({ showMsg: true, msgOpen: true});

            } else {
                console.log("error");
                this.msg = "Failed to delete the " + objToDelete;
                this.severity = "error";
                this.setState({ showMsg: true, msgOpen: true});
            }

        } else {
            console.log("error");
            this.msg = "Failed to delete the " + objToDelete;
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }
    }

    /* onClick handler of the deletion button of a module. */
    moduleDeletionButtonHandler(event, module) {
        event.stopPropagation();
        this.moduleToDelete = module;

        // ask the user to confirm the deletion
        this.setState({ 
            showConfirmDialogModule: true,
            confirmDialogOpenModule: true
        });
    }

    /* onClick handler of the deletion button of a subject. */
    subjectDeletionButtonHandler(event, subject) {
        event.stopPropagation();
        this.subjectToDelete = subject;

        // ask the user to confirm the deletion
        this.setState({ 
            showConfirmDialogSubject: true,
            confirmDialogOpenSubject: true
        });
    }

    /////////////////////////////////////// create one for subjects and files.
    handleCloseConfirmModule(event) {
        event.stopPropagation();

        // send the deletion request to the server.
        this.objectDeletionHandling(deleteModuleByMajor, 'module');
        
        console.log("closing the dialog");

        // update the view to be without the deleted module.
        this.setState({ confirmDialogOpenModule: false });
    }

    handleCloseConfirmSubject(event) {
        event.stopPropagation();

        // send the deletion request to the server.
        this.objectDeletionHandling(deleteSubjectByModule, 'subject');
        
        // update the view to be without the deleted subject.
        this.setState({ confirmDialogOpenSubject: false });
    }

    /* closing of the confirm deletion dialog - after pressing cancel. */
    handleCloseCancel(event) {
        event.stopPropagation();

        if (this.state.confirmDialogOpenModule === true) {
            this.setState({ confirmDialogOpenModule: false });
        }

        else if (this.state.confirmDialogOpenSubject === true) {
            this.setState({ confirmDialogOpenSubject: false});
        }

        else if (this.state.confirmDialogOpenFile === true) {
            this.setState({ confirmDialogOpenFile: true });
        }
    }

    /* closing of the informative msg. */
    handleMsgClose() {
        this.setState({ msgOpen: false });
    }

	render() {

        // classes - for styling
        const { classes } = this.props;

        return (
            <Grid item xs={11}>             
            {
            (this.state.chosenMajor !== undefined) ? 
            <div>
                {
                (this.state.moduleData === undefined) ? <h4 className={classes.myFont}>
                    No modules under the major {this.state.chosenMajor}
                </h4> : 
                <List>

                { /* used when the user wants to delete a module. */
                (this.state.showConfirmDialogModule === true) ? 
                    <ConfirmationDialog 
                    handleCloseConfirm={this.handleCloseConfirmModule}
                    handleCloseCancel={this.handleCloseCancel}
                    confirmDialogOpen={this.state.confirmDialogOpenModule}/> : ''}

                { /* used when the user wants to delete a subject. */
                (this.state.showConfirmDialogSubject === true) ? 
                    <ConfirmationDialog 
                    handleCloseConfirm={this.handleCloseConfirmSubject}
                    handleCloseCancel={this.handleCloseCancel}
                    confirmDialogOpen={this.state.confirmDialogOpenSubject}/> : ''}

                    

                { /* used to show informative msg regarding the deletion */
                (this.state.showMsg === true) ? <Snackbar open={this.state.msgOpen} 
                autoHideDuration={3000}
                onClose={this.handleMsgClose}>
                    <Alert onClose={this.handleMsgClose} severity={this.severity}>
                    {this.msg}
                    </Alert>
                </Snackbar> : '' }

                {this.state.moduleData.map((module) => (
                    <Accordion
                    expanded={this.state.expanded === module}
                    onChange={this.handleAccordionChange(module)}
                    key={module}>
                        
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content">
                            
                            <Typography style={{flexBasis: "98.00%"}}>
                                    {module}
                            </Typography>

                            <IconButton aria-label="delete" 
                            onClick={(event) => this.moduleDeletionButtonHandler(event, module)}>                        
                                <DeleteIcon />
                            </IconButton>
                            
                        </AccordionSummary>
                        
                        <AccordionDetails>
                            <Grid item xs={12}>
                            <Typography component={'span'} className={classes.myFont}>
                                {
                                (this.state.moduleUpdate === true)
                                ? <div>
                                    {
                                    (this.subjectsData === undefined) ? <h4 className={classes.myFont}>
                                        No subjects under the module {this.state.chosenModule}
                                    </h4> : 
                                    <div className={classes.root}>
                                        <List>
                                            {this.subjectsData.map((subject) => (

                                                <Accordion 
                                                expanded={this.state.expandedSubject === subject}
                                                onChange={this.handleSubjectChange(subject)}                                                                key={subject}
                                                labelname={subject}>

                                                    <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content">

                                                        <Typography style={{flexBasis: "98.00%"}}>
                                                            {subject}
                                                        </Typography>

                                                        <IconButton aria-label="delete" 
                                                        onClick={(event) => this.subjectDeletionButtonHandler(event, subject)}>                        
                                                            <DeleteIcon />
                                                        </IconButton>

                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        <Grid item xs={12}>
                                                        <Typography component={'span'} className={classes.myFont}>
                                                            {
                                                            /* insert the different files in the subject */
                                                            (this.state.filesUpdate === true) ? <div>
                                                                {
                                                                (this.filesData === undefined) ? <h4 className={classes.myFont}>
                                                                No files under the subject {this.state.chosenSubject}
                                                                </h4> :
                                                                <DisplayFiles files={this.filesData}/>
                                                                }
                                                            </div>
                                                            : ''
                                                            }
                                                        </Typography>
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>

                                            ))}
                                        </List>
                                    </div>
                                    }
                                </div>
                                : ''
                                }
                            </Typography>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
                </List>
                }
            </div> : ''
            }
            </Grid>
        );
    }
}
	
export default withStyles(useStyles, { withTheme: true })(FileSystemDisplay);