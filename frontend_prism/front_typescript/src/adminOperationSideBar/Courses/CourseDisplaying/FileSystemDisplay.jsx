import { List, Accordion, withStyles, Grid, Typography, Button } from "@material-ui/core";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from "react"
import { getSubjectsByModule, getFilesBySubject } from "../../CourseFiles/files_request_handler";
import DisplayFiles from "./DisplayFiles";


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



class FileSystemDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.handleAccordionChange = this.handleAccordionChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.subjectsData = undefined;
        this.filesData = undefined;

        this.state = {
            expanded: false,
            expandedSubject: false,
            chosenMajor: this.props.chosenMajor,
            chosenModule: undefined,
            chosenSubject: undefined,
            moduleUpdate: false,
            filesUpdate: false,
            moduleData: this.props.moduleData
        };
    }

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
    }

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
    }

    componentDidUpdate() {
        if (this.props.chosenMajor !== this.state.chosenMajor) {
            this.setState({ chosenMajor: this.props.chosenMajor });
        }

        if (this.props.moduleData !== this.state.moduleData) {
            this.setState({ moduleData: this.props.moduleData })
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
                {
                (this.state.moduleData === undefined) ? <h4 className={classes.myFont}>
                    No modules under the major {this.state.chosenMajor}
                </h4> : 
                <List>
                {this.state.moduleData.map((module) => (
                    <Accordion
                    expanded={this.state.expanded === module}
                    onChange={this.handleAccordionChange(module)}
                    key={module}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content">
                            {module}

                        <Button
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log("hi");
                        }}>click me
                        
                        </Button>
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
                                                        {subject}
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