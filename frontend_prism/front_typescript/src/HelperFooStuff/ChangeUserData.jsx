import TextField from '@material-ui/core/TextField';
import React from "react"

export default class ChangeUserData extends React.Component {

	constructor(props) {
		super(props);

		this.handleTextFieldChangeUsername = this.handleTextFieldChangeUsername.bind(this);
		this.handleTextFieldChangeFirstName = this.handleTextFieldChangeFirstName.bind(this)
		this.handleTextFieldChangeLastName = this.handleTextFieldChangeLastName.bind(this)
		this.handleTextFieldChangePhoneNum = this.handleTextFieldChangePhoneNum.bind(this)


				
		this._username =  undefined
		this._firstName = undefined
		this._lastName = undefined
		this._phone_number = undefined

    }


    handleTextFieldChangeUsername(event) {
		let input =  event.target.value
		//this.state.username = input
		this._username = input
	}

	handleTextFieldChangeFirstName(event) {
		let input =  event.target.value
		//this.state.firstName = input
		this._firstName = input
	}

	handleTextFieldChangeLastName(event) {
		let input =  event.target.value
		//this.state.lastName = input
		this._lastName = input
	}

	handleTextFieldChangePhoneNum(event){
		let input =  event.target.value
		//this.state.phone_number = input
		this._phone_number = input	
	}


    render() {



      return (

			<div>
                    <h2> HERE YOU CAN CHANGE DATA </h2>
					<TextField onChange={this.handleTextFieldChangeUsername}
								
								variant="filled"
								label="username" 
                                >

					</TextField>


					<TextField
								disabled id="standard-disabled" 
								variant="filled"
								label="username" 
								defaultValue= {this.props.prev_username}>

					</TextField>
					<br></br>
					<br></br>
					
					<TextField onChange={this.handleTextFieldChangeFirstName}
								
								variant="filled"
								label="First Name" >
	
					</TextField>

					
					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="First Name" 
								defaultValue={this.props.prev_firstName}>

					</TextField>
					

					<br></br>
					<br></br>

					<TextField onChange={this.handleTextFieldChangeLastName}
								
								variant="filled"
								label="Last Name" >
	
					</TextField>


					<TextField 
								disabled id="standard-disabled"
								variant="filled"
								label="Last Name" 
								defaultValue={this.props.prev_lastName}>

					</TextField>

					<br></br>
					<br></br>
					

					<TextField onChange={this.handleTextFieldChangePhoneNum}
								
								variant="filled"
								label="Phone num" >
	
					</TextField>

					<TextField 

								disabled id="standard-disabled" 
								variant="filled"
								label="Phone number" 
								defaultValue={this.props.prev_phone_number}>

					</TextField>

					<br></br>
					<br></br>



          </div>

      )
    }
  }