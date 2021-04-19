import { Grid, Select, withStyles, FormControl, InputLabel, List, Accordion, Typography } from "@material-ui/core";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getModulesByMajor, getSubjectsByModule, getFilesBySubject } from "../../HelperJS/files_request_handler";
import { Major } from "../../HelperJS/Major";


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
        this.handleAccordionChange = this.handleAccordionChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.majors = undefined;
        this.moduleData = undefined;
        this.subjectsData = undefined;
        this.filesData = undefined;

        this.state = {
            expanded: false,
            expandedSubject: false,
            updated: false,
            chosenMajor: undefined,
            chosenModule: undefined,
            moduleUpdate: false,
            filesUpdate: false,
        };
    }

    handleMajorChange(event) {
        let eventValue = event.target.value;

        if (eventValue !== "None") {
            getModulesByMajor(eventValue).then(({data}) => {
                
                // the list of modules we received from the server.
                this.moduleData = data;
                this.setState({
                    chosenMajor: eventValue
                });
            });

        // The user pressed the default empty option.
        } else {
            this.moduleData = undefined;
            this.setState({
                chosenMajor: undefined
            });
        }
    }

    handleAccordionChange = (panel) => (event, isExpanded) => {

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

                console.log(data);
                this.subjectsData = data;

                this.setState({
                    moduleUpdate: true,
                    chosenModule: moduleName,
                });
            });
        }
    }

    handleSubjectChange = (panel) => (event, isExpanded) => {

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

        //console.log(panel);

        if (subjectName !== undefined && subjectName !== null && subjectName !== 'None') {
            getFilesBySubject(this.state.chosenMajor, this.state.chosenModule, subjectName)
            .then(({data}) => {

                //console.log(data);
                this.filesData = data;

                this.setState({
                    filesUpdate: true
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

        // When we retrieved the current user's majors.
        if (this.state.updated) {
            return (
                <Grid container>
                    <MenuAppBar
                    menu={
                        <CommanderMenu />
                    }
                    content={
                        <Grid container spacing={2} justify="flex-start" className={classes.padding}>
                            <Grid item xs={12}>
                                <br/>
                                <br/>

                                <FormControl className={classes.formControl} style={{minWidth: 200}}>
                                <InputLabel htmlFor="age-native-simple">Choose Major</InputLabel>
                                <Select
                                native
                                value={undefined}
                                onChange={this.handleMajorChange}
                                >
                                <option aria-label="None" value="None" />
                                {(this.majors.includes(Major.Software)) ? 
                                    <option value={Major.Software}>Software</option> : ''
                                }
                                {(this.majors.includes(Major.Reserach)) ? 
                                    <option value={Major.Reserach}>Research</option> : ''
                                }
                                {(this.majors.includes(Major.Firmware)) ? 
                                    <option value={Major.Firmware}>Firmware</option> : ''
                                }
                                {(this.majors.includes(Major.Validation)) ? 
                                    <option value={Major.Validation}>Validation</option> : ''
                                }
                                {(this.majors.includes(Major.Network)) ? 
                                    <option value={Major.Network}>Network</option> : ''
                                }
                                </Select>
                            </FormControl>
                            
                            </Grid>
                            <Grid item xs={11}>
                            
                            {
                            (this.state.chosenMajor !== undefined) 
                            ? 
                            <div>
                                {
                                (this.moduleData === undefined || this.moduleData.length === 0)
                                ? <h2 className={classes.myFont}>
                                    No modules under the major {this.state.chosenMajor}
                                </h2>
                                : 
                                <List>
                                {this.moduleData.map((module) => (
                                    <Accordion
                                    expanded={this.state.expanded === module}
                                    onChange={this.handleAccordionChange(module)}
                                    key={module}>
                                        <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content">
                                            {module}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid item xs={12}>
                                            <Typography component={'span'} className={classes.myFont}>
                                                {
                                                (this.state.moduleUpdate === true)
                                                ? <div>
                                                    {
                                                    (this.subjectsData === undefined || this.subjectsData === null 
                                                        || this.subjectsData === 'None' || this.subjectsData.length === 0)
                                                        
                                                    ? <h2 className={classes.myFont}>
                                                        No subjects under the module {this.state.chosenModule}
                                                    </h2>
                                                    : 
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
                                                                            (this.state.filesUpdate === true) 
                                                                            ? <div>
                                                                                {
                                                                                (this.filesData === undefined || this.filesData === null
                                                                                || this.filesData === 'None' || this.filesData.length === 0)
                                                                                ? <h2 className={classes.myFont}>
                                                                                No subjects under the module {this.state.chosenModule}
                                                                                </h2> 
                                                                                :
                                                                                <ul>
                                                                                    {this.filesData.map((file) => (
                                                                                        <li key={file.file_name}>
                                                                                            {file.url}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
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