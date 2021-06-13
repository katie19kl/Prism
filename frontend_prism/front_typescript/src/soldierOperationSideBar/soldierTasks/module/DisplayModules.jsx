import React from "react"
import {getModulesByMajor} from "../../../adminOperationSideBar/CourseFiles/files_request_handler"
import {IoSchool} from "react-icons/io5";
import { Breadcrumbs, Typography, withStyles } from "@material-ui/core";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


const useStyles = (theme) => ({

    padding: {
        marginRight: theme.spacing(2),
    },
    paddingLeft: {
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(3),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    }
})


  

class DisplayModules extends React.Component {

    constructor(props) {
        super(props)
        this.state  = { modules:undefined}
    }


    componentDidMount() {

        let user = this.props.user

        let major = user["major"]

        getModulesByMajor(major).then((res)=>{
            if (res !== undefined){
                
                console.log(res)
                console.log("----------------------")
                this.setState({modules: res.data})
            }
        })
    }

    render() {
  
        const { classes } = this.props;
        let user = this.props.user;
        let major = user["major"];
        let modulesOfMajor = this.state.modules;
        let personalId = user["personalId"];

        console.log("personalId: ", personalId);
        
        return (
            <div>

                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.paddingLeft}>
					<Typography className={classes.myFont} variant="h5" color="primary">{major}</Typography>
				</Breadcrumbs>
                

                <ul className="list-group list-group-flush">
            
                {modulesOfMajor !== undefined && modulesOfMajor.map((module,index)=>(

                
                    <li className="list-group-item" key={index}  >
                        <IoSchool className={classes.padding}/>
                    
                        <a href={"./module_content/" + module + "/" + major + "/" + personalId }

                            style={{color: '#5E1363', ':visited': {color: 'pink'}}}>
                                 
                            {module}

                        </a>
                        
                    </li>
                    
                    ))
                }
                </ul>
                    
            </div>
        )
    }

}


export default withStyles(useStyles, { eithTheme: true })(DisplayModules)


/*
fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                            <a href={file.url}>{file.file_name}</a>
                            </li>
                        ))}
*/