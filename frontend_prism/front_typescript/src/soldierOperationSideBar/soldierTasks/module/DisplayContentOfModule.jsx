import React from "react"
import MenuAppBar from "./../../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../../GeneralComponent/soldier/SoldierMenu"
import {getFilesBySubject} from "./../../../adminOperationSideBar/CourseFiles/files_request_handler"
import ContentOfModule from "./ContentOfModule"
import WaiterLoading from "../../../HelperFooStuff/WaiterLoading"
import { getUserInfoByJWT } from "../../../HelperJS/extract_info"
import { getAllowedSubjectsOfUser } from "../../../adminOperationSideBar/CourseStatus/subject_on_demand"
import Role from '../../../Roles/Role';


export default class DisaplayContentOfModule extends React.Component {

    constructor(props) {
        super(props)
        this.state  = { subjects:undefined, dirSubjectFiles:undefined };
        this.numberSubjects = -1;
        this.nothingHere = false;
    }

    componentDidMount() {

        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;



        getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined) {
				
			} else {
				user = user.data;
				
                let personalId = user["personalId"] ;
				

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
                            
                            
                          
                
                            
                                getFilesBySubject(major,moduleName,subject).then((res_files)=>{
        
                                    if (res_files !== undefined){
                                        let files = res_files.data
                                        
                                        dir[subject] = files
                                        this.setState({dirSubjectFiles:dir})
                                        
                                    }
                                })
        
                            }
                        }
                        
                    
                    }
        
        
                })

            }
        })
    }

    render() {

        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;
        let personalId = this.props.match.params.personalId;
        let subjects = this.state.subjects;


        if (subjects !== undefined){
            subjects.sort()
        
            
        }


        if (this.nothingHere){
            return (
                <MenuAppBar
                    role ={Role.Soldier} 
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                        //<WaiterLoading />
                        <h2>NOTHING ALLOWED ( ALL IS CLOSED) </h2>
                    }>

                </MenuAppBar>
            );
        }

        if (this.state.dirSubjectFiles !== undefined && subjects !== undefined){
            
            if (this.numberSubjects === Object.keys(this.state.dirSubjectFiles).length){

                
                let dict = this.state.dirSubjectFiles

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
                                >

                                </ContentOfModule>

                                
                            </div>
                        }>
                            
                    </MenuAppBar>
                )
            } else {
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
                )
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
            )
        }
    }

}