import { withStyles } from '@material-ui/core';
import React from "react"
import { FaPython } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";
import {FaFilePdf} from "react-icons/fa";
import {GrDocumentTxt} from "react-icons/gr";
import { IconContext } from "react-icons";


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
    padding: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
});


class DisplayCoursesUploadBar extends React.Component {

    constructor(props) {
        super(props);

        this.file = this.props.file
    }

	render() {
  
        const { classes } = this.props;

		let word = <FaFileWord className={classes.padding}/>
		let py  = <FaPython className={classes.padding}/>
		let archieve = <FaFileArchive className={classes.padding}/>
		let pdf = <FaFilePdf className={classes.padding}/>
		let txt = <GrDocumentTxt className={classes.padding}/>
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
