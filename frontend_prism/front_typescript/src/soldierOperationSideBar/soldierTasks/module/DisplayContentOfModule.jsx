import React from "react"
import MenuAppBar from "./../../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../../GeneralComponent/soldier/SoldierMenu"
import { getFilesBySubject } from "./../../../adminOperationSideBar/CourseFiles/files_request_handler"
import ContentOfModule from "./ContentOfModule"
import WaiterLoading from "../../../HelperFooStuff/WaiterLoading"
import { getUserInfoByJWT } from "../../../HelperJS/extract_info"
import { getAllowedSubjectsOfUser } from "../../../adminOperationSideBar/CourseStatus/subject_on_demand"
import Role from '../../../Roles/Role';
import { Typography, withStyles, Grid, Breadcrumbs } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { purple } from "@material-ui/core/colors"
import { getListSubmissionOfSubject } from "../../soldierSubmission/submission_handling"
import { Status } from "../../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus"
import OK_Status from "../../soldierSubmission/OK_Status"


const useStyles = (theme) => ({
    myFont: {
        fontFamily: 'monospace',
    },
    myFont2: {
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
    },
    myFont3: {
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        color: purple[400],
    },
    padding: {
        marginTop: theme.spacing(5),
    }
});


class DisaplayContentOfModule extends React.Component {

    constructor(props) {
        super(props)
        this.state  = { subjects:undefined, dirSubjectFiles:undefined };
        this.numberSubjects = -1;
        this.nothingHere = false;

        this.subjectWithSubmission = []
    }

    componentDidMount() {

        console.log("Submmsion ifo ggeeett")

        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;

        getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined) {
				
			} else {
				user = user.data;
				
                let personalId = user["personalId"];
				
           

                //getSubjectsByModule(major, moduleName).then( (res)=>{
                getAllowedSubjectsOfUser(major, moduleName, personalId).then((res) => {
                    
                    this.nothingHere = false
                        
                    if (res !== undefined){
                        

                        let toSet = res.data
                        
                        if (res.data === undefined){
                            toSet = []
                        }else {
                            toSet = res.data
                        }
                        // nothing permitted
                        if (toSet.length === 0){
                            
                     
                            this.nothingHere = true
                            toSet = []
                        }
                        
                 
                        this.setState({subjects:toSet})
                            
                        if (toSet !== undefined){
                   
                            this.numberSubjects = toSet.length
        
                            let dir = {}
                            for (const subject of toSet) {
                            
                 
                                getListSubmissionOfSubject(major, moduleName,subject,personalId).then((res)=>{


                                
                                
                                    let submissionExist = false
                                    let submissionGrade
                                    if (res !== undefined){
                                        if (res.data !== undefined){

                                            submissionGrade = res.data.gradeDescription
                                            
                                        }
                                    }

                           

                                    if (submissionGrade === OK_Status.OK || submissionGrade === OK_Status.NOT_OK){
                                        submissionExist = true
                                    }



                                    if (submissionExist){
                                        this.subjectWithSubmission.push(subject)                          
                                    }
                            
                                    getFilesBySubject(major,moduleName,subject).then((res_files)=>{
            
                                        if (res_files !== undefined){
                                            let files = res_files.data
                                            


                                            
                                            dir[subject] = files

                                            this.setState({dirSubjectFiles:dir})
                                            
                                        }
                                    })
                                })
        
                            }
                        }
                        
                    
                    }
        
        
                })

            }
        })
    }

    render() {

        console.log(this.subjectWithSubmission)


        const { classes } = this.props;

        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;
        let personalId = this.props.match.params.personalId;
        let subjects = this.state.subjects;


        if (subjects !== undefined) {
            subjects.sort();    
        }

        if (this.nothingHere) {
            return (
                <MenuAppBar
                    role ={Role.Soldier} 
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                        <div>
                            
                            <Grid className={classes.padding}
                            item container xs={12} 
                            justify="center" alignItems="center">

                                <Breadcrumbs separator={<NavigateNextIcon 
                                fontSize="small" />} 
                                aria-label="breadcrumb" 
                                className={classes.nav}>

                                    <Typography 
                                    className={classes.myFont2}
                                    variant="h5" 
                                    color="primary">
                                        {major}
                                    </Typography>


                                    <Typography 
                                    className={classes.myFont3} 
                                    variant="h5" 
                                    color="primary">
                                        {moduleName}
                                    </Typography>

                                </Breadcrumbs>
                            </Grid>

                            <br />

                            <Grid item container justify='center' alignItems='center' xs={12}>
                                <Typography 
                                variant='h5' 
                                className={classes.myFont}>
                                    <b> No Assignments were added to this module </b> 
                                </Typography>
                            </Grid>

                        </div>
                    }>
                </MenuAppBar>
            );
        }

        if (this.state.dirSubjectFiles !== undefined && subjects !== undefined){
            
            if (this.numberSubjects === Object.keys(this.state.dirSubjectFiles).length){
                
                let dict = this.state.dirSubjectFiles

                console.log(dict)
                return (
                    <MenuAppBar
                        role ={Role.Soldier} 
                        menu={
                            <SoldierMenu/>
                        }
                        content={
                            
                            <div>
                                <ContentOfModule 
                                moduleName={moduleName}
                                major = {major}
                                subjects = {subjects}
                                dictSubjectFiles = {dict}
                                personalId={personalId}
                                reviewedSubjects={this.subjectWithSubmission}>
                                </ContentOfModule>
                            </div>
                        }>
                            
                    </MenuAppBar>
                );
            } else {
                return (
                    <MenuAppBar
                        role ={Role.Soldier} 
                        menu={
                            <SoldierMenu />
                        }
                        content={
                            <WaiterLoading />
                        }>
    
                    </MenuAppBar>
                );
            }
        }
        else {
            return (
                <MenuAppBar
                    role ={Role.Soldier} 
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                        
                        <WaiterLoading />
                    }>    

                </MenuAppBar>
            );
        }
    }
}

export default withStyles(useStyles, { eithTheme: true })(DisaplayContentOfModule)
