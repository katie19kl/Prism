import { Grid, withStyles } from "@material-ui/core";
import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import TesterMenu from "../../GeneralComponent/tester/TesterMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getModulesByMajor, getSubjectsByModule, getFilesBySubject } from "./files_request_handler";
import MajorSelect from "../Courses/CourseDisplaying/MajorSelect";
import FileSystemDisplay from "../Courses/CourseDisplaying/FileSystemDisplay";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";
import Role from "../../Roles/Role";


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
        this.getSubjectsOfModules = this.getSubjectsOfModules.bind(this);
        this.getFilesOfSubjects = this.getFilesOfSubjects.bind(this);
        this.majors = undefined;
        this.moduleData = undefined;
        this.modules_subjects = undefined;

        this.myRole = undefined;

        this.state = {
            updated: false,
            chosenMajor: undefined,
            finalMajor: undefined,
            modules: undefined,
            modulesToSubjects: undefined,
            subjectsToFiles: undefined,
            modulesToDictSubsToFiles: undefined,
        };
    }

    handleMajorChange(event) {
        let eventValue = event.target.value;

        if (eventValue !== "None") {
            this.sendGetModulesRequest(eventValue);

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

            getModulesByMajor(currMajor).then((res) => {
                if (res !== undefined) {

                    let data = res.data;
                    if (data === undefined || data === 'None' || data === null 
                        || data.length === 0) {
                        data = undefined;
                    }

                    // the list of modules we received from the server.
                    this.moduleData = data;

                    // for each module, retrieve the subjects
                    this.getSubjectsOfModules(this.moduleData, currMajor)
                    .then((modules_subjects) => {

                        let mod_sub = {};
                        for (const dict_mod_sub of modules_subjects) {
    
                            for (const [key, value] of Object.entries(dict_mod_sub)) {
                                mod_sub[key] = value;
                                
                            } 
                        }
                        
                        // module to subjects dict.
                        this.modules_subjects = mod_sub;
                        				
                        // Given subjects & modules -> extract all files.
                        this.getFilesOfSubjects(this.modules_subjects, currMajor)
                        .then((subToFiles) => {

                            let sub_files = {};
                            for (const dict_sub_to_file of subToFiles) {
        
                                for (const [key, value] of Object.entries(dict_sub_to_file)) {
                                    sub_files[key] = value;
                                    
                                } 
                            }

                            let modulesToDictSubsToFiles = {};
                            for (const module in this.modules_subjects) {
                                let currModuleToDict = {};

                                for (const subject of this.modules_subjects[module]) {
                                    currModuleToDict[subject] = sub_files[subject];
                                }

                                modulesToDictSubsToFiles[module] = currModuleToDict;
                            }


                            const listModules = Object.keys(modulesToDictSubsToFiles);

                            this.setState({
                                chosenMajor: currMajor,
                                modules: listModules,
                                modulesToSubjects: modules_subjects,
                                subjectsToFiles: sub_files,
                                modulesToDictSubsToFiles: modulesToDictSubsToFiles
                            });
                        });
                    });
                }
            });
        }
    }

    getSubjectsOfModules(modules, selectedMajor) {

		let arrPromises = [];

        if (modules === undefined) {
            modules = [];
        }

		for (const module of modules) {

			arrPromises.push(getSubjectsByModule(selectedMajor, module)
            .then((res) => {

				return new Promise ((resol, rej) => {
					if (res !== undefined) {
						if (res.data !== undefined) {
		
							let modul_subject = {};
							modul_subject[module] = res.data;
							resol(modul_subject);
		
						} else {
							rej(undefined);
						}
					} else {
						rej(undefined);
					}
				});
			}));
		}

		let resolvedPromises = Promise.all(arrPromises) 
		
		return resolvedPromises;
	}

    getFilesOfSubjects(modules_to_subs, selectedMajor) {

		let arrPromises = [];

        // go over the keys in the dict(modules)
		for (const module in modules_to_subs) {

            for (const subject of modules_to_subs[module]) {
                
                arrPromises.push(getFilesBySubject(selectedMajor, module, subject)
                .then((res) => {

                    return new Promise ((resol, rej) => {
                        if (res !== undefined) {
                            if (res.data !== undefined) {
            
                                let files_of_sub = {};
                                files_of_sub[subject] = res.data;
                                resol(files_of_sub);
            
                            } else {
                                rej(undefined);
                            }
                        } else {
                            rej(undefined);
                        }
                    });
                }));
            }
		}

		let resolvedPromises = Promise.all(arrPromises) 
		
		return resolvedPromises;
	}

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                if (user.data !== undefined){
                        
                    // Retrieve the user info.
                    user = user.data;
                    this.myRole = user["role"];
                    this.majors = user["major"];
                    this.setState({
                        updated: true
                    });
                }
            }
        });
    }

    render() {
        const { classes } = this.props;
        
        if (this.state.updated) {

            let menu = undefined;

            if (this.myRole === Role.Commander || this.myRole === Role.Admin) {
                menu = <CommanderMenu />
            
            } else if (this.myRole === Role.Tester) {
                menu = <TesterMenu />
            }

            return (
                <Grid container>
                    <MenuAppBar
                    role ={this.myRole}
                    menu={menu}
                    content={
                        
                        <Grid 
                        container 
                        spacing={2} 
                        justify="flex-start" 
                        className={classes.padding}>
                            
                            <MajorSelect 
                            majors={this.majors} 
                            handleMajorChange={this.handleMajorChange}/>

                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>

                            <FileSystemDisplay 
                            chosenMajor={this.state.chosenMajor} 
                            modules={this.state.modules}
                            modulesToSubjects={this.state.modulesToSubjects}
                            subjectsToFiles={this.state.subjectsToFiles}
                            sendGetModulesRequest={this.sendGetModulesRequest} 
                            modulesToDictSubsToFiles={this.state.modulesToDictSubsToFiles}
                            role={this.myRole} />
                            
                        </Grid>
                    }>
                    </MenuAppBar>
                </Grid>
            );
        } else {
            return <WaiterLoading />
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(CourseFilesMainView); 