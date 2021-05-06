import React from "react"

import { FaPython } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";
import {FaFilePdf} from "react-icons/fa";
import {GrDocumentTxt} from "react-icons/gr";
import {IconContext} from "react-icons";
import DisplayFiles from "../../../adminOperationSideBar/Courses/CourseDisplaying/DisplayFiles";
import Role from "../../../Roles/Role";

export default class DisplaySubjectContent extends React.Component {


    render(){
        console.log("============= content of subject ===============")
        

        let moduleName = this.props.moduleName
        let major = this.props.major
        let subject = this.props.subject
        let dictSubjectFiles = this.props.dictSubjectFiles

        let arrFiles = dictSubjectFiles[subject]
        


        // if there is no files yet 
        if (arrFiles.length === 0){
            arrFiles = [{file_name:"ss"}]
            arrFiles[0].file_name = "EMPTY _ XUI "
        }
        
 
            return (
    
                    <div>
                        <DisplayFiles files={arrFiles} role={Role.Soldier}/>
                
                    </div>

            )
        
    }

}

{/*    <ul className="list-group list-group-flush">
                
                        {arrFiles !== undefined && arrFiles.map( (file,index)=>(

                            <h2>
                                {file.file_name}
                                 
                            </h2>
                            
                            
                            ))
                        }
                    </ul>
  */}