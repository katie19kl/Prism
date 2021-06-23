import { List, Accordion, withStyles, Grid, Typography, Snackbar, IconButton,
     ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import React from "react"
import DisplayFiles from "./DisplayFiles";
import MuiAlert from '@material-ui/lab/Alert';
import { purple } from "@material-ui/core/colors";
import CourseUploading from "../CourseUploading/CourseUploading";
import DialogsManager from "./DialogsManager";
import { getSubjectsByModule, getFilesBySubject,
    deleteModuleByMajor, deleteSubjectByModule, 
    deleteFileBySubject, createModuleByMajor, 
    createSubjectByModule, renameModule, 
    renameSubject } from "../../CourseFiles/files_request_handler";
import Role from "../../../Roles/Role";


const useStyles = (_theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 
    }
});

/* shows the alert msg when editing is done. */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class FileSystemDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.handleAccordionChange = this.handleAccordionChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.moduleDeletionButtonHandler = this.moduleDeletionButtonHandler.bind(this);
        this.subjectDeletionButtonHandler = this.subjectDeletionButtonHandler.bind(this);
        this.FileDeletionButtonHandler = this.FileDeletionButtonHandler.bind(this);
        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.handleCloseConfirmModule = this.handleCloseConfirmModule.bind(this);
        this.handleCloseConfirmFile = this.handleCloseConfirmFile.bind(this);
        this.handleMsgClose = this.handleMsgClose.bind(this);
        this.objectDeletionHandling = this.objectDeletionHandling.bind(this);
        this.handleDeletionResponse = this.handleDeletionResponse.bind(this);
        this.handleCloseConfirmSubject = this.handleCloseConfirmSubject.bind(this);
        this.handleGetSubjectRequest = this.handleGetSubjectRequest.bind(this);
        this.handleGetFilesRequest = this.handleGetFilesRequest.bind(this);
        this.sendGetModulesRequest = this.props.sendGetModulesRequest;
        this.handleInsertModule = this.handleInsertModule.bind(this);
        this.handleInsertSubject = this.handleInsertSubject.bind(this);
        this.handleCloseInsertModule = this.handleCloseInsertModule.bind(this);
        this.handleCloseInsertSubject = this.handleCloseInsertSubject.bind(this);
        this.handleCloseCancelInsertion = this.handleCloseCancelInsertion.bind(this);
        this.moduleInsertionOnChange = this.moduleInsertionOnChange.bind(this);
        this.subjectInsertionOnChange = this.subjectInsertionOnChange.bind(this);
        this.handleInsertionResponse = this.handleInsertionResponse.bind(this);
        this.renameModuleOnClick = this.renameModuleOnClick.bind(this);
        this.renameSubjectOnClick = this.renameSubjectOnClick.bind(this);
        this.handleCloseEditModule = this.handleCloseEditModule.bind(this);
        this.handleCloseEditSubject = this.handleCloseEditSubject.bind(this);
        this.handleCloseCancelEdit = this.handleCloseCancelEdit.bind(this);
        this.handleRenamingResponse = this.handleRenamingResponse.bind(this);

        this.subjectsData = undefined;
        this.filesData = undefined;

        // used when sending the deletion req. to the server.
        this.moduleToDelete = undefined;
        this.subjectToDelete = undefined;
        this.fileToDelete = undefined;

        // showing informative msgs when the users is deleting module/subject.
        this.msg = undefined;
        this.severity = undefined;

        // when creating new module/subject (/when renaming).
        this.newModuleName = undefined;
        this.newSubjectName = undefined;

        // when renaming existing module/subject.
        this.oldModuleName = undefined;
        this.oldSubjectName = undefined; 

        this.state = {
            expanded: false,
            expandedSubject: false,

            chosenMajor: this.props.chosenMajor,
            chosenModule: undefined,
            chosenSubject: undefined,

            moduleUpdate: false,
            filesUpdate: false,
            moduleData: this.props.moduleData,

            // deleting objects(module/subjects/files).
            showConfirmDialogModule: false,
            showConfirmDialogSubject: false,
            showConfirmDialogFile: false,
            confirmDialogOpenModule: false,
            confirmDialogOpenSubject: false,
            confirmDialogOpenFile: false,

            // creating objects(module/subjects/files).
            showModuleInsertionDialog: false,
            moduleInsertionDialogOpen: false,
            showSubjectInsertionDialog: false,
            subjectInsertionDialogOpen: false,

            // renameing module/subjects.
            showModuleRenameDialog: false,
            moduleRenameDialogOpen: false,
            showSubjectRenameDialog: false,
            subjectRenameDialogOpen: false,


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
        
            getSubjectsByModule(this.state.chosenMajor, moduleName).then((data) => {
            if (data !== undefined){
                data = data.data
            }
            
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

    /* check for changes in props(parent component). */
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
                    
                    if (this.state.chosenSubject !== undefined) {
                        this.handleGetFilesRequest(this.state.chosenSubject);
                    }
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

            if (response.status !== undefined && response.status === 200) {
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

    /* onClick handler of the deletion button of a file. */
    FileDeletionButtonHandler(event, file) {
        event.stopPropagation();
        this.fileToDelete = file;

        // ask the user to confirm the deletion
        this.setState({ 
            showConfirmDialogFile: true,
            confirmDialogOpenFile: true
        });
    }

    /* handling confirmation of module deletion. */
    handleCloseConfirmModule(event) {
        event.stopPropagation();

        // send the deletion request to the server.
        this.objectDeletionHandling(deleteModuleByMajor, 'module');
        
        console.log("closing the dialog");

        // update the view to be without the deleted module.
        this.setState({ confirmDialogOpenModule: false });
    }

    /* handling confirmation of subject deletion. */
    handleCloseConfirmSubject(event) {
        event.stopPropagation();

        // send the deletion request to the server.
        this.objectDeletionHandling(deleteSubjectByModule, 'subject');
        
        // update the view to be without the deleted subject.
        this.setState({ confirmDialogOpenSubject: false });
    }

    /* handling confirmation of file deletion. */
    handleCloseConfirmFile(event) {
        event.stopPropagation();

        // send the deletion request to the server.
        this.objectDeletionHandling(deleteFileBySubject, 'file');
        
        // update the view to be without the deleted file.
        this.setState({ confirmDialogOpenFile: false });
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
            this.setState({ confirmDialogOpenFile: false });
        }
    }

    /* closing of the informative msg. */
    handleMsgClose() {
        this.setState({ msgOpen: false });
    }

    /* activates the informative msg depending on the server's response. */
    handleInsertionResponse(response, objToInsert) {

        console.log("-----------")
        console.log(response)
        console.log("-----------")
        
        if (response !== undefined) {

            if (response.status !== undefined && response.status === 201) {
                this.msg = objToInsert + " created successfully";
                this.severity = "success";
                this.setState({ showMsg: true, msgOpen: true});

            } else if (response.response !== undefined) {
                /*console.log("--------424 Erroring--------")
                console.log(response)
                console.log("-----------")
                console.log(response.response)
                console.log("-----------")
                console.log(response.response.status)
                console.log("-----------------------------")
                */
                if (response.response.status !== undefined && response.response.status === 409) {
                    
                    this.msg = "The name already exists! Try a different one";
                    this.severity = "error";
                    this.setState({ showMsg: true, msgOpen: true});
                }

            } else {
                this.msg = "Failed to create the " + objToInsert;
                this.severity = "error";
                this.setState({ showMsg: true, msgOpen: true});
            }

        } else {
            console.log("error");
            this.msg = "Failed to create the " + objToInsert;
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }
    }

    /* handler of inserting new module (button). */
    handleInsertModule() {

        // show module insertion dialog.
        this.setState({ 
            showModuleInsertionDialog: true,
            moduleInsertionDialogOpen: true,
        });
    }

    /* handler of inserting new subject (button). */
    handleInsertSubject() {

        // show subject insertion dialog.
        this.setState({ 
            showSubjectInsertionDialog: true,
            subjectInsertionDialogOpen: true,
        });
    }

    /* onChange of text field in the insertion dialog (module). */
    moduleInsertionOnChange(event) {
        this.newModuleName = event.target.value;
    }

    /* onChange of text field in the insertion dialog (subject). */
    subjectInsertionOnChange(event) {
        this.newSubjectName = event.target.value;
    }

    /* sending to the server the create request (module). */
    handleCloseInsertModule(event) {
        event.stopPropagation();

        // send req to server.
        if (this.state.chosenMajor !== undefined && this.newModuleName !== undefined) {

            if (this.newModuleName !== '' && this.newModuleName !== ' ') {

                createModuleByMajor(this.state.chosenMajor, this.newModuleName)
                .then((response) => {

                    // show informative msg to the screen.
                    this.handleInsertionResponse(response, 'module');

                    if (response !== undefined) {
                        if (response.status === 201) {

                            // update the view to contain the new created module.
                            this.sendGetModulesRequest(this.state.chosenMajor);
                        }
                    }
                });
            }

        } else {

            console.log("error");
            this.msg = "You did not enter the new module name";
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }

        // change back to undefined!!!!! important!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.newModuleName = undefined;

        this.setState({ 
            moduleInsertionDialogOpen: false
        });
    }

    /* sending to the server the create request (subject). */
    handleCloseInsertSubject(event) {

        event.stopPropagation();

        // send req to server.
        if (this.state.chosenModule !== undefined && this.newSubjectName !== undefined) {

            if (this.newSubjectName !== '' && this.newSubjectName !== ' ') {

                createSubjectByModule(this.state.chosenMajor, this.state.chosenModule, this.newSubjectName)
                .then((response) => {

                    this.handleInsertionResponse(response, 'subject');

                    if (response !== undefined) {
                        if (response.status === 201) {

                            // update the view to contain the new created subject.
                            this.handleGetSubjectRequest(this.state.chosenModule);
                        }
                    }
                });
            }

        } else {

            console.log("error");
            this.msg = "You did not enter the new subject name";
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }

        // change back to undefined
        this.newSubjectName = undefined;

        this.setState({ subjectInsertionDialogOpen: false });
    }

    /* the user regrets creating new module/subject. */
    handleCloseCancelInsertion(event) {
        event.stopPropagation();

        if (this.state.moduleInsertionDialogOpen === true) {
            this.setState({ moduleInsertionDialogOpen: false });
        } 

        else if(this.state.subjectInsertionDialogOpen === true) {
            this.setState({ subjectInsertionDialogOpen: false });
        }

    }

    /* activates the informative msg depending on the server's response. */
    handleRenamingResponse(response, objToRename) {

        console.log(response);
        console.log("----------------------!!!")


        if (response !== undefined) {

            if (response.status !== undefined && response.status === 200) {
                console.log('success');
                this.msg = objToRename + " renamed successfully";
                this.severity = "success";
                this.setState({ showMsg: true, msgOpen: true});

            } else if (response.response !== undefined) {

                if (response.response.status === 409) {
                    
                    console.log("I am here!!!!!!")
                    this.msg = "The name already exists! Try a different one";
                    this.severity = "error";
                    this.setState({ showMsg: true, msgOpen: true});
                }

            } else {
                console.log("error");
                this.msg = "Failed to rename the " + objToRename;
                this.severity = "error";
                this.setState({ showMsg: true, msgOpen: true});
            }

        } else {
            console.log("error");
            this.msg = "Failed to rename the " + objToRename;
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }
    }

    /* onClick of pressing the renaming button (module). */
    renameModuleOnClick(event, module) {

        event.stopPropagation();
        this.oldModuleName = module;

        this.setState({ 
            showModuleRenameDialog: true,
            moduleRenameDialogOpen: true
        });
    }

    /* onClick of pressing the renaming button (subject). */
    renameSubjectOnClick(event, subject) {

        event.stopPropagation();
        this.oldSubjectName = subject;

        this.setState({ 
            showSubjectRenameDialog: true,
            subjectRenameDialogOpen: true
        });
    }

    /* sending to the server the rename request (module). */
    handleCloseEditModule(event) {
        event.stopPropagation();

        // send req to server.
        if (this.state.chosenMajor !== undefined && this.newModuleName !== undefined
            && this.oldModuleName !== undefined) {

            if (this.newModuleName !== '' && this.newModuleName !== ' ') {

                renameModule(this.state.chosenMajor, this.oldModuleName, this.newModuleName)
                .then((response) => {

                    this.handleRenamingResponse(response, 'module');

                    if (response !== undefined) {

                        console.log("status of put is: ", response.status);

                        if (response.status === 200) {

                            // update the view to contain the new created module.
                            this.sendGetModulesRequest(this.state.chosenMajor);
                        }
                    }
                });
            }

        } else {

            console.log("error");
            this.msg = "You did not enter the new module name";
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }

        this.newModuleName = undefined;
        this.oldModuleName = undefined;

        this.setState({ 
            moduleRenameDialogOpen: false
        });
    }

    /* sending to the server the create request (subject). */
    handleCloseEditSubject(event) {
        event.stopPropagation();

         // send req to server.
         if (this.state.chosenModule !== undefined && this.newSubjectName !== undefined
            && this.oldSubjectName !== undefined) {

            if (this.newSubjectName !== '' && this.newSubjectName !== ' ') {

                renameSubject(this.state.chosenMajor, this.state.chosenModule,
                    this.oldSubjectName, this.newSubjectName)
                .then((response) => {

                    this.handleRenamingResponse(response, 'subject');

                    if (response.status !== undefined) {
                        if (response.status === 200) {

                            // update the view to contain the new created subject.
                            this.handleGetSubjectRequest(this.state.chosenModule);
                        }
                    }
                });
            }

        } else {

            console.log("error");
            this.msg = "You did not enter the new subject name";
            this.severity = "error";
            this.setState({ showMsg: true, msgOpen: true});
        }

        // change back to undefined
        this.newSubjectName = undefined;
        this.oldSubjectName = undefined;

        this.setState({ subjectRenameDialogOpen: false });
    }

    /* the user regrets renaming the module/subject. */
    handleCloseCancelEdit(event) {
        event.stopPropagation();

        if (this.state.moduleRenameDialogOpen === true) {
            this.setState({ moduleRenameDialogOpen: false });
        }

        else if (this.state.subjectRenameDialogOpen === true) {
            this.setState({ subjectRenameDialogOpen: false });
        }
    }

	render() {

        // classes - for styling
        const { classes } = this.props;

        return (
            <Grid item xs={11}>             
            {
            (this.state.chosenMajor !== undefined) ? 
            <div>

                <DialogsManager
                handleCloseInsertModule={this.handleCloseInsertModule}
                handleCloseCancelInsertion={this.handleCloseCancelInsertion}
                moduleInsertionOnChange={this.moduleInsertionOnChange}
                handleCloseInsertSubject={this.handleCloseInsertSubject}
                subjectInsertionOnChange={this.subjectInsertionOnChange}
                handleCloseConfirmModule={this.handleCloseConfirmModule}
                handleCloseCancel={this.handleCloseCancel}
                handleCloseConfirmSubject={this.handleCloseConfirmSubject}
                handleCloseConfirmFile={this.handleCloseConfirmFile}
                handleCloseEditModule={this.handleCloseEditModule}
                handleCloseCancelEdit={this.handleCloseCancelEdit}
                handleCloseEditSubject={this.handleCloseEditSubject}

                showModuleInsertionDialog={this.state.showModuleInsertionDialog}
                showSubjectInsertionDialog={this.state.showSubjectInsertionDialog}
                showConfirmDialogModule={this.state.showConfirmDialogModule}
                showConfirmDialogSubject={this.state.showConfirmDialogSubject}
                showConfirmDialogFile={this.state.showConfirmDialogFile}
                showModuleRenameDialog={this.state.showModuleRenameDialog}
                showSubjectRenameDialog={this.state.showSubjectRenameDialog}
                moduleInsertionDialogOpen={this.state.moduleInsertionDialogOpen}
                subjectInsertionDialogOpen={this.state.subjectInsertionDialogOpen}
                confirmDialogOpenModule={this.state.confirmDialogOpenModule}
                confirmDialogOpenSubject={this.state.confirmDialogOpenSubject}
                confirmDialogOpenFile={this.state.confirmDialogOpenFile}
                moduleRenameDialogOpen={this.state.moduleRenameDialogOpen}
                subjectRenameDialogOpen={this.state.subjectRenameDialogOpen}
                />

                {
                (this.state.moduleData === undefined) ? <div>
                    <h4 className={classes.myFont}>
                        No modules under the major {this.state.chosenMajor}
                    </h4>
                    <ListItem button onClick={this.handleInsertModule}>
                        <ListItemIcon style={{flexBasis: "5.00%"}}>
                            <AddCircleOutlineOutlinedIcon color="primary"/>
                        </ListItemIcon>
                        <ListItemText primary="Create new Module"/>
                    </ListItem>
                </div> : 
                <List>
                
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

                            <IconButton aria-label="edit" 
                            onClick={(event) => this.renameModuleOnClick(event, module)}>                        
                                <CreateIcon color="primary"/>
                            </IconButton>

                            <IconButton aria-label="delete" 
                            onClick={(event) => this.moduleDeletionButtonHandler(event, module)}>                        
                                <DeleteIcon color="primary"/>
                            </IconButton>
                            
                        </AccordionSummary>
                        
                        <AccordionDetails>
                            <Grid item xs={12}>
                            <Typography component={'span'} className={classes.myFont}>
                                {
                                (this.state.moduleUpdate === true)
                                ? <div>
                                    {
                                    (this.subjectsData === undefined) ? <div>
                                            <h4 className={classes.myFont}>
                                                No subjects under the module {this.state.chosenModule}
                                            </h4>
                                            <ListItem button onClick={this.handleInsertSubject}>
                                                <ListItemIcon style={{flexBasis: "5.00%"}}>
                                                    <AddCircleOutlineOutlinedIcon color="primary"/>
                                                </ListItemIcon>
                                                <ListItemText primary="Create new Subject"/>
                                            </ListItem>
                                        </div> : 
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

                                                        <IconButton aria-label="edit" 
                                                        onClick={(event) => this.renameSubjectOnClick(event, subject)}>                        
                                                            <CreateIcon style={{ color: purple[400]}}/>
                                                        </IconButton>

                                                        <IconButton aria-label="delete" 
                                                        onClick={(event) => this.subjectDeletionButtonHandler(event, subject)}>                        
                                                            <DeleteIcon style={{ color: purple[400]}}/>
                                                        </IconButton>

                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        <Grid item xs={12}>
                                                        <Typography component={'span'} className={classes.myFont}>
                                                            {
                                                            /* insert the different files in the subject */
                                                            (this.state.filesUpdate === true) ? <div>
                                                                {
                                                                (this.filesData === undefined) ? <div>
                                                                    <h4 className={classes.myFont}>
                                                                        No files under the subject {this.state.chosenSubject}
                                                                    </h4>
                                                                    <CourseUploading 
                                                                    chosenMajor={this.state.chosenMajor}
                                                                    chosenModule={this.state.chosenModule}
                                                                    chosenSubject={this.state.chosenSubject}
                                                                    handleGetFilesRequest={this.handleGetFilesRequest}
                                                                    />
                                                                </div> :
                                                                <div>
                                                                    <DisplayFiles files={this.filesData}
                                                                    FileDeletionButtonHandler={this.FileDeletionButtonHandler}
                                                                    role={Role.Commander}/>
                                                                    <CourseUploading 
                                                                    chosenMajor={this.state.chosenMajor}
                                                                    chosenModule={this.state.chosenModule}
                                                                    chosenSubject={this.state.chosenSubject}
                                                                    handleGetFilesRequest={this.handleGetFilesRequest}/>
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
                                            <ListItem button onClick={this.handleInsertSubject}>
                                                <ListItemIcon style={{flexBasis: "5.00%"}}>
                                                    <AddCircleOutlineOutlinedIcon color="primary"/>
                                                </ListItemIcon>
                                                <ListItemText primary="Create new Subject"/>
                                            </ListItem>
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
                    <ListItem button onClick={this.handleInsertModule}>
                        <ListItemIcon style={{flexBasis: "5.00%"}}>
                            <AddCircleOutlineOutlinedIcon color="primary"/>
                        </ListItemIcon>
                        <ListItemText primary="Create new Module"/>
                    </ListItem>
                </List>
                }
            </div> : ''
            }
            </Grid>
        );
    }
}
	
export default withStyles(useStyles, { withTheme: true })(FileSystemDisplay);