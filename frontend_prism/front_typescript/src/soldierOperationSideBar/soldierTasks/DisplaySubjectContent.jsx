import React from "react"

import { FaPython } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";
import {FaFilePdf} from "react-icons/fa";
import {GrDocumentTxt} from "react-icons/gr";
import {IconContext} from "react-icons";

export default class DisplaySubjectContent extends React.Component {


    render(){
        console.log("============= content of subject ")
        

        //let moduleName = this.props.moduleName
        //let major = this.props.major
        let subject = this.props.subject
        let dictSubjectFiles = this.props.dictSubjectFiles

        let arrFiles = dictSubjectFiles[subject]
        
        
        if (arrFiles.length === 0){
            arrFiles = [{file_name:"ss"}]
            arrFiles[0].file_name = "EMPTY _ XUI "
        }
        
 
            return (
    
                    <div>
                        <IconContext.Provider
                            value={{ color: 'blue', size: '50px' }}
                            >
                            <div>
                                <FaPython />
                        
                            </div>
                        </IconContext.Provider>
                        
                        
                        <FaFileWord/>    
                        <FaFileArchive/>
                        <FaFilePdf/>
                        <GrDocumentTxt/>

                        <h2>
                            
                            {arrFiles[0].file_name}
                        </h2>


                        

                
                </div>

            )
        
    }

}
