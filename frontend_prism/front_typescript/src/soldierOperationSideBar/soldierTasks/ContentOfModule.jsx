import React from "react"

import DisplaySubjectContent from "./DisplaySubjectContent";


export default class ContentOfModule extends React.Component {


    render(){
        console.log("-----content of module---------")
        

        let moduleName = this.props.moduleName
        let major = this.props.major
        let subjects = this.props.subjects

        let dictSubjectFiles = this.props.dictSubjectFiles
        console.log(Object.keys(dictSubjectFiles))


        let postfix_param = major + "/" + moduleName + "/"
        console.log(postfix_param)
        //console.log(dictSubjectFiles[subjects[0]][0].file_name)
        return (
 
                <div>
                        <h2> Module |{moduleName}| in major |{major}| </h2>
                        <ul className="list-group list-group-flush">
                
                        {subjects !== undefined && subjects.map( (subject,index)=>(

                    
                            <li className="list-group-item" key={index}  >
                                
                                <i> X {subject} X
                                    <div>
                                        <DisplaySubjectContent
                                        subject = {subject}
                                        dictSubjectFiles = {dictSubjectFiles}
                                        major = {major}
                                        moduleName={moduleName}
                                        >

                                        </DisplaySubjectContent>
                                    </div>  
                                </i>


                                
                       
                                <a href={"/submission/info/" + postfix_param + subject}> Submission info of subject </a>
                                

                            </li>
                            
                            ))

                            
                        }


                            
                        </ul>
                </div>

        )
    }

}