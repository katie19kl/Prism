import React from "react"
import MenuAppBar from "./../../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../../GeneralComponent/soldier/SoldierMenu"
import {getFilesBySubject} from "./../../../adminOperationSideBar/CourseFiles/files_request_handler"
import ContentOfModule from "./ContentOfModule"
import WaiterLoading from "../../../HelperFooStuff/WaiterLoading"
import { getUserInfoByJWT } from "../../../HelperJS/extract_info"
import { getAllowedSubjectsOfUser } from "../../../adminOperationSideBar/CourseStatus/subject_on_demand"



export default class DisaplayContentOfModule extends React.Component {

    constructor(props) {
        super(props)
        this.state  = { subjects:undefined, dirSubjectFiles:undefined }
        this.numberSubjects = -1
        this.nothingHere = false
    }

    componentDidMount() {

        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;



        getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined){
				
			} else {

                
				console.log("here user was given")
				user = user.data
				
                let personalId = user["personalId"] 
				

                //getSubjectsByModule(major, moduleName).then( (res)=>{
                getAllowedSubjectsOfUser(major, moduleName, personalId).then((res)=>{
                    
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
                            
                            console.log("NOTHING WAS HERE ")
                            this.nothingHere = true
                            toSet = []
                        }
                        
                        console.log("----------------=======")
                        this.setState({subjects:toSet})
                            
                        if (toSet !== undefined){
                   
                            this.numberSubjects = toSet.length
        
                            let dir = {}
                            for (const subject of toSet) {
                            
                            
                                console.log(subject)
                
                            
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
        
/*
        getSubjectsByModule(major, moduleName).then( (res)=>{
            
            if (res !== undefined){
                
                
                    console.log(res.data)
                    this.setState({subjects:res.data})
                    
                if (res.data !== undefined){
                    this.numberSubjects = res.data.length

                    let dir = {}
                    for (const subject of res.data) {
                    
                    
                        console.log(subject)
        
                    
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


        })*/
    }

    render() {
        console.log(" content of module")
        console.log(this.numberSubjects)
        let moduleName = this.props.match.params.moduleName;
        let major = this.props.match.params.major;
        let personalId = this.props.match.params.personalId;
        let subjects = this.state.subjects;

        console.log("---------")
        console.log(subjects)
        console.log("---------")

        if (this.nothingHere){
            return (
                <MenuAppBar
                    role = "Soldier" 
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                        //<WaiterLoading />
                        <h2>NOTHING </h2>
                    }>

                    </MenuAppBar>
                    )
        }

        if (this.state.dirSubjectFiles !== undefined && subjects !== undefined){
            
 
            
            if (this.numberSubjects === Object.keys(this.state.dirSubjectFiles).length){

                
                let dict = this.state.dirSubjectFiles
                               
                for (var key in dict) {
                    console.log(key)
                }
                console.log("---------------------------")
                console.log("---------------------------")

                return (
                    <MenuAppBar
                        role = "Soldier" 
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
            }else {
                return (
                    <MenuAppBar
                        role = "Soldier" 
                        menu={
                            <SoldierMenu/>
                        }
                        content={
                            <WaiterLoading />
                            //<h2>NOTHING </h2>
                        }>
    
                        </MenuAppBar>
                )
            }
        }
        else {
            return (
                <MenuAppBar
                    role = "Soldier" 
                    menu={
                        <SoldierMenu/>
                    }
                    content={
                        
                        <WaiterLoading />
                        //<h2>NOTHING </h2>
                    }>    

                    </MenuAppBar>
            )
        }
    }

}