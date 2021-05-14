import React from "react"
import MenuAppBar from "./../../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../../GeneralComponent/soldier/SoldierMenu"
import {getSubjectsByModule} from "./../../../adminOperationSideBar/CourseFiles/files_request_handler"
import {getFilesBySubject} from "./../../../adminOperationSideBar/CourseFiles/files_request_handler"
import ContentOfModule from "./ContentOfModule"



export default class DisaplayContentOfModule extends React.Component {

    constructor(props){
        super(props)
        this.state  = { subjects:undefined, dirSubjectFiles:undefined}
        this.numberSubjects = -1
    }

    componentDidMount(){

        let moduleName = this.props.match.params.moduleName
        let major = this.props.match.params.major

        getSubjectsByModule(major, moduleName).then( (res)=>{
            
            if (res !== undefined){
                
                console.log(res.data)
                this.setState({subjects:res.data})
                
                this.numberSubjects = res.data.length

                let dir = {}
                for (const subject of res.data){
                   
                
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


        })
    }

    render(){
        console.log(" content of module")
        console.log(this.numberSubjects)
        let moduleName = this.props.match.params.moduleName
        let major = this.props.match.params.major
        
        let subjects = this.state.subjects
        


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
                    }>

                    </MenuAppBar>
            )
        }
    }

}