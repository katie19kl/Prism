import  { Component } from "react";
import { Button, withStyles } from '@material-ui/core';
import React from "react"
import {uploadSingleFiles} from './file_uploading_handle'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import {CgRemoveR} from "react-icons/cg"
import { FaPython } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";
import {FaFilePdf} from "react-icons/fa";
import {GrDocumentTxt} from "react-icons/gr";
import MuiAlert from '@material-ui/lab/Alert';	
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import { IconContext } from "react-icons";
import DisplayCourseUploadBar from "./DisplayCoursesUploadBar"

const useStyles = (theme) => ({
	root: {
	  flexGrow: 1,
	  maxWidth: 752,
	},
	demo: {
	  backgroundColor: theme.palette.background.paper,
	},
	title: {
	  margin: theme.spacing(4, 0, 2),
	},
});


class DisplayCoursesUploadBar extends React.Component {

    constructor(props) {
        super(props);

        this.file = this.props.file
    }



    
    
	render() {
  
        const { classes } = this.props;

		let word = <FaFileWord/>
		let py  = <FaPython />
		let archieve = <FaFileArchive/>
		let pdf = <FaFilePdf/>
		let txt = <GrDocumentTxt/>

        let file = this.file

        return (
            <div>
							{ file.substring(file.length-2) === "py" ? 	
							<IconContext.Provider
                            	value={{ color: 'blue', size: '25px' }}>
                                {py}
                            </IconContext.Provider> : "" }

							{ file.substring(file.length-3) === "pdf" ? 
							<IconContext.Provider
                            	value={{ color: 'blue', size: '25px' }}>
                                {pdf}
                            </IconContext.Provider> : "" }

							{ file.substring(file.length-3) === "zip" ? 
							<IconContext.Provider
                            	value={{ color: 'blue', size: '25px' }}>
                                {archieve}
                            </IconContext.Provider> : "" }

							{ file.substring(file.length-4) === "docx" ? 
							<IconContext.Provider
                            	value={{ color: 'blue', size: '25px' }}>
                                {word}
                            </IconContext.Provider> : "" }

							{ file.substring(file.length-3) === "txt" ? 
							<IconContext.Provider
								value={{ color: 'blue', size: '25px' }}>
								{txt}
							</IconContext.Provider> : "" }

            </div>
        
        );
    }
}
	

export default withStyles(useStyles, { withTheme: true })(DisplayCoursesUploadBar); 
