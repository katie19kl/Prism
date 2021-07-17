import React from "react";
import { withStyles } from '@material-ui/core/styles';
import InsertionDialog from "../../../GeneralComponent/dialogs/InsertionDialog";
import ConfirmationDialog from "../../../GeneralComponent/dialogs/ConfirmationDialog";
import RenameDialog from "../../../GeneralComponent/dialogs/RenameDialog";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
});


class DialogsManager extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseInsertModule = this.props.handleCloseInsertModule;
        this.handleCloseCancelInsertion = this.props.handleCloseCancelInsertion;
        this.moduleInsertionOnChange = this.props.moduleInsertionOnChange;
        this.handleCloseInsertSubject = this.props.handleCloseInsertSubject;
        this.subjectInsertionOnChange = this.props.subjectInsertionOnChange;
        this.handleCloseConfirmModule = this.props.handleCloseConfirmModule;
        this.handleCloseCancel = this.props.handleCloseCancel;
        this.handleCloseConfirmSubject = this.props.handleCloseConfirmSubject;
        this.handleCloseConfirmFile = this.props.handleCloseConfirmFile;
        this.handleCloseEditModule = this.props.handleCloseEditModule;
        this.handleCloseCancelEdit = this.props.handleCloseCancelEdit;
        this.handleCloseEditSubject = this.props.handleCloseEditSubject;

        
        this.state ={
            showModuleInsertionDialog: this.props.showModuleInsertionDialog,
            showSubjectInsertionDialog: this.props.showSubjectInsertionDialog,
            showConfirmDialogModule: this.props.showConfirmDialogModule,
            showConfirmDialogSubject: this.props.showConfirmDialogSubject,
            showConfirmDialogFile: this.props.showConfirmDialogFile,
            showModuleRenameDialog: this.props.showModuleRenameDialog,
            showSubjectRenameDialog: this.props.showSubjectRenameDialog,

            moduleInsertionDialogOpen: this.props.moduleInsertionDialogOpen,
            subjectInsertionDialogOpen: this.props.subjectInsertionDialogOpen,
            confirmDialogOpenModule: this.props.confirmDialogOpenModule,
            confirmDialogOpenSubject: this.props.confirmDialogOpenSubject,
            confirmDialogOpenFile: this.props.confirmDialogOpenFile,
            moduleRenameDialogOpen: this.props.moduleRenameDialogOpen,
            subjectRenameDialogOpen: this.props.subjectRenameDialogOpen,
            
        };
    }

    componentDidUpdate() {
        
        if (this.state.showModuleInsertionDialog !== this.props.showModuleInsertionDialog) {
            this.setState({ showModuleInsertionDialog: this.props.showModuleInsertionDialog});
        }

        if (this.state.showSubjectInsertionDialog !== this.props.showSubjectInsertionDialog) {
            this.setState({ showSubjectInsertionDialog: this.props.showSubjectInsertionDialog});
        }

        if (this.state.showConfirmDialogModule !== this.props.showConfirmDialogModule) {
            this.setState({ showConfirmDialogModule: this.props.showConfirmDialogModule});
        }

        if (this.state.showConfirmDialogSubject !== this.props.showConfirmDialogSubject) {
            this.setState({ showConfirmDialogSubject: this.props.showConfirmDialogSubject});
        }

        if (this.state.showConfirmDialogFile !== this.props.showConfirmDialogFile) {
            this.setState({ showConfirmDialogFile: this.props.showConfirmDialogFile});
        }

        if (this.state.showModuleRenameDialog !== this.props.showModuleRenameDialog) {
            this.setState({ showModuleRenameDialog: this.props.showModuleRenameDialog});
        }

        if (this.state.showSubjectRenameDialog !== this.props.showSubjectRenameDialog) {
            this.setState({ showSubjectRenameDialog: this.props.showSubjectRenameDialog});
        }

        if (this.state.moduleInsertionDialogOpen !== this.props.moduleInsertionDialogOpen) {
            this.setState({ moduleInsertionDialogOpen: this.props.moduleInsertionDialogOpen});
        }

        if (this.state.subjectInsertionDialogOpen !== this.props.subjectInsertionDialogOpen) {
            this.setState({ subjectInsertionDialogOpen: this.props.subjectInsertionDialogOpen});
        }

        if (this.state.confirmDialogOpenModule !== this.props.confirmDialogOpenModule) {
            this.setState({ confirmDialogOpenModule: this.props.confirmDialogOpenModule});
        }

        if (this.state.confirmDialogOpenSubject !== this.props.confirmDialogOpenSubject) {
            this.setState({ confirmDialogOpenSubject: this.props.confirmDialogOpenSubject});
        }

        if (this.state.confirmDialogOpenFile !== this.props.confirmDialogOpenFile) {
            this.setState({ confirmDialogOpenFile: this.props.confirmDialogOpenFile});
        }

        if (this.state.moduleRenameDialogOpen !== this.props.moduleRenameDialogOpen) {
            this.setState({ moduleRenameDialogOpen: this.props.moduleRenameDialogOpen});
        }

        if (this.state.subjectRenameDialogOpen !== this.props.subjectRenameDialogOpen) {
            this.setState({ subjectRenameDialogOpen: this.props.subjectRenameDialogOpen});
        }

    }

    render() {
        return (
            <div>
                { /* used when the user wants to insert new module. */
                (this.state.showModuleInsertionDialog === true) ?
                    <InsertionDialog 
                    insertDialogOpen={this.state.moduleInsertionDialogOpen}
                    handleCloseInsert={this.handleCloseInsertModule}
                    handleCloseCancelInsertion={this.handleCloseCancelInsertion}
                    handleClose={this.handleCloseCancelInsertion}
                    dialogGoal="Insert Module"
                    labelName="Module Name"
                    insertionOnChange={this.moduleInsertionOnChange}/> : ''}

                { /* used when the user wants to insert new subject. */
                (this.state.showSubjectInsertionDialog === true) ?
                    <InsertionDialog 
                    insertDialogOpen={this.state.subjectInsertionDialogOpen}
                    handleCloseInsert={this.handleCloseInsertSubject}
                    handleCloseCancelInsertion={this.handleCloseCancelInsertion}
                    handleClose={this.handleCloseCancelInsertion}
                    dialogGoal="Insert Subject"
                    labelName="Subject Name"
                    insertionOnChange={this.subjectInsertionOnChange}/> : ''}

                { /* used when the user wants to delete a module. */
                (this.state.showConfirmDialogModule === true) ? 
                    <ConfirmationDialog 
                    handleCloseConfirm={this.handleCloseConfirmModule}
                    handleCloseCancel={this.handleCloseCancel}
                    confirmDialogOpen={this.state.confirmDialogOpenModule}
                    dialogGoal="Module Deletion"/> : ''}

                { /* used when the user wants to delete a subject. */
                (this.state.showConfirmDialogSubject === true) ? 
                    <ConfirmationDialog 
                    handleCloseConfirm={this.handleCloseConfirmSubject}
                    handleCloseCancel={this.handleCloseCancel}
                    confirmDialogOpen={this.state.confirmDialogOpenSubject}
                    dialogGoal="Subject Deletion"/> : ''}


                { /* used when the user wants to delete a file. */
                (this.state.showConfirmDialogFile === true) ? 
                    <ConfirmationDialog 
                    handleCloseConfirm={this.handleCloseConfirmFile}
                    handleCloseCancel={this.handleCloseCancel}
                    confirmDialogOpen={this.state.confirmDialogOpenFile}
                    dialogGoal="File Deletion"/> : ''}


                { /* used when the user wants to rename a module. */
                (this.state.showModuleRenameDialog === true) ?
                    <RenameDialog 
                    handleCloseEdit={this.handleCloseEditModule}
                    handleCloseCancelEdit={this.handleCloseCancelEdit}
                    handleClose={this.handleCloseCancelEdit}
                    dialogGoal="Rename Module"
                    labelName="Module Name"
                    editOnChange={this.moduleInsertionOnChange}
                    RenameDialogOpen={this.state.moduleRenameDialogOpen}/> : ''}


                { /* used when the user wants to rename a module. */
                (this.state.showSubjectRenameDialog === true) ?
                    <RenameDialog 
                    handleCloseEdit={this.handleCloseEditSubject}
                    handleCloseCancelEdit={this.handleCloseCancelEdit}
                    handleClose={this.handleCloseCancelEdit}
                    dialogGoal="Rename Subject"
                    labelName="Subject Name"
                    editOnChange={this.subjectInsertionOnChange}
                    RenameDialogOpen={this.state.subjectRenameDialogOpen}/> : ''}
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(DialogsManager);