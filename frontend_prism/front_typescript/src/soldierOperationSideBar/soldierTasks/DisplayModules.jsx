import React from "react"
import {getModulesByMajor} from "./../../adminOperationSideBar/CourseFiles/files_request_handler"
import {IoSchool} from "react-icons/io5";

export default class DisplayModules extends React.Component {

    constructor(props){
        super(props)
        this.state  = { modules:undefined}
    }


    componentDidMount(){

        let user = this.props.user

        let major = user["major"]

        getModulesByMajor(major).then( (res)=>{
            if (res !== undefined){
                
                console.log(res)
                console.log("----------------------")
                this.setState({modules: res.data})
            }
        })
    }

    render(){
  

        let user = this.props.user

        let major = user["major"]


        let modulesOfMajor = this.state.modules
        

    

        return (
            <div>
                    <h2> Modules of major :  {major}</h2>
                    

                    <ul className="list-group list-group-flush">
                
                    {modulesOfMajor !== undefined && modulesOfMajor.map( (module,index)=>(

                   
                        <li className="list-group-item" key={index}  >
                             <IoSchool />
                       
                            <a href={"./module_content/"+module+"/"+major}>{module}</a>

                            
                        </li>
                        
                        ))
                    }
                    </ul>
                    
            </div>
        )
    }

}

/*
fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                            <a href={file.url}>{file.file_name}</a>
                            </li>
                        ))}
*/