import React from "react"
import FormControl from '@material-ui/core/FormControl';


import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
//import { withStyles } from "@material-ui/core";
import Select from '@material-ui/core/Select';
/*
const useStyles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
});*/


class ModulesDisplaying  extends React.Component {
    constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this);
        //this.state = {moduleSelected: undefined}
    }

    handleChange(event){
       // let selected = event.target.value;

        //console.log(selected)

    }


	render() {
        //const { classes } = this.props;
      
        return (
           <div>
                <h2> SELECT all</h2>

    
   



                <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          
          onChange={this.handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
   
                
                <FormHelperText>Choose major</FormHelperText>
            <h2> SELECT all</h2>
  
          </div>
        )
    }

}
export default ModulesDisplaying
//export default withStyles( useStyles, { withTheme: true })(ModulesDisplaying);