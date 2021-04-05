import TextField from '@material-ui/core/TextField';
import React from "react"

export default class DisplayUserData extends React.Component {
    render() {



      return (
          <div>

            <TextField
                disabled id="standard-disabled_" 
                variant="filled"
                label="username" 
                defaultValue= {this.props.username}>

            </TextField>
            
            
            <TextField
                disabled id="standard-disabled=" 
                variant="filled"
                label="password" 
                defaultValue="******" >

            </TextField>

            
            
            
            <dd></dd>
            <br></br>
            
            <TextField	
                        disabled id="standard-disabled!" 	
                        variant="filled"
                        label="majors"
                        defaultValue={this.props.major} >
            </TextField>

            
            <TextField	
                        disabled id="standard-disabled__" 	
                        variant="filled"
                        label="Gender"
                        defaultValue={this.props.gender} >
            </TextField>




            <dd></dd>
            <br></br>

            <TextField 
                disabled id="standard-disabled=_"
                variant="filled"
                label="First Name" 
                defaultValue={this.props.firstName}>

            </TextField>


            <TextField 
                disabled id="standard-disabled=_="
                variant="filled"
                label="Last Name" 
                defaultValue={this.props.lastName}>

            </TextField>

            <dd></dd>
            <br></br>
            <TextField	
                        disabled id="standard-disabled=_=_" 	
                        variant="filled"
                        label="Role"
                        defaultValue={this.props.role} >
            </TextField>

            <TextField 
                disabled id="standard-disabled_=__" 
                variant="filled"
                label="Phone number" 
                defaultValue={this.props.phone_number}>

            </TextField>
          </div>
      )
    }
  }