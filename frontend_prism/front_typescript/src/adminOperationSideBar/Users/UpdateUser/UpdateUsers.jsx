import React from "react";
import { withStyles } from '@material-ui/core/styles';
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import SaveIcon from '@material-ui/icons/Save';
import { Button, TextField} from "@material-ui/core";
import DisplayUserData from "../../../HelperFooStuff/DisplayUserData";

import {getUserInfoByJWT, getUserInfoById, getSoldiersByMajor} from "../../../HelperJS/extract_info"
import ChangeUserData from "../../../HelperFooStuff/ChangeUserData";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
});




class UpdateUsers extends React.Component {
    

    constructor(props) {
        super(props);
        this.handleChangeSelectSoldier = this.handleChangeSelectSoldier.bind(this);
        this.updateUserInfo = this.updateUserInfo(this)

        this.soldier_id = undefined
        this.soldier_firstName = undefined
        this.soldier_secondName = undefined
        this.soldier_phone = undefined
        this.soldier_username = undefined
        
        
        this.state = { _selected: false, _error: false, _users_retrieved: false }
        
        this.form = undefined

        this.soldierInCommanderMajor = [
            {
                firstName: ' ',
                lastName: ' None',
                personalId: ' ' 
            },
            {
                firstName: 'Sergio_1',
                lastName: 'Jack_1',
                personalId: "0123456789"
            },
            {
                firstName: 'Donald_2',
                lastName: 'Trump_2',
                personalId: "0123446789"
            },
            {
                firstName: 'Ganz_3',
                lastName: 'Jonica_3',
                personalId: "0123446999"
            }
        ] ;
        
      

    }

    updateUserInfo() {

    if (this.soldier_id !== undefined){

    }

        
    }

    componentDidMount(){

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                user = user.data
                let major = user["major"]

                getSoldiersByMajor(major).then((users) =>{
                    if (users === undefined ){
                        this.setState({_users_retrieved: true})
                        
                    }else {
                        
                    console.log("(((((((((((((((")
                    console.log(users)

                    users = users.data
                    for (user of users) {
                        console.log(user);
                        let personalIdUser = user.personalId
                        let firstNameUser = user.firstName
                        let lastNameUser = user.lastName

                        let line = {
                                firstName: firstNameUser,
                                lastName: lastNameUser,
                                personalId: personalIdUser 
                            }

                            this.soldierInCommanderMajor.push(line)

                        }

                      

                        console.log(")))))))))))))))")

                        //this.setState({_users_retrieved: true})
                    
                    }
                    
                    //sort displaying by personal id 
                    this.soldierInCommanderMajor.sort( (a,b) => a.personalId - b.personalId)

                    this.setState({_users_retrieved: true})
                })
            }
        });
    }

     
     

    // user selected => display its info 
    handleChangeSelectSoldier(event) {
        
        console.log(event.target.value + "  !!!!!!!!!!!!!!")
        this.soldier_id = event.target.value
        
        // make default values to cause re-rendering when user was sellected
        this.setState({_selected: false, _error: false})

        getUserInfoById(this.soldier_id).then( (user) => {

            // none was choosen
            if (user === undefined){
                console.log(user + " <--1")
                this.form = <h2>problem with user loading </h2>
                this.setState({_error: true})
            }
            // user doesnt exist
            else if (user.data === ""){
                console.log(user + " <--1")
                this.form = <h2>problem with user loading </h2>
                this.setState({_error: true})
            }else {
                

                console.log(user + " <--2")
                let data = user.data
                
                let phone_num = data.phoneNumber
                let userName = data.username
                let firstName = data.firstName
                let lastName = data.lastName
                let role = data.role
                let gender = data.gender
                let major = data.major

                this.soldier_phone = phone_num
                this.soldier_username = userName
                this.soldier_firstName = firstName
                this.soldier_secondName = lastName
                
                
                this.form = <DisplayUserData 
                major = {major} 
                gender = {gender}
                role = {role}
                lastName = {lastName}
                firstName = {firstName}
                username = {userName}
                phone_number = {phone_num}
                >
                    
                </DisplayUserData>


                this.setState({_selected: true})
                }
        }, (error)=>{

            this.form = <h2>problem with user loading </h2>
            this.setState({error: true})
        })
    }

    render() {

        console.log(" renders update")
            
        if (this.state._users_retrieved){
                return (
                    <MenuAppBar 
                    menu={
                        <CommanderMenu/>
                    }
                    content={
                        
                        <div>
    
                            <h2> Choose which one you want to update</h2>

                            
                            <br></br>

                            <br></br>
                            <TextField
                            select
                            label="Soldier info "
                            value={this.soldier_id}
                            onChange={this.handleChangeSelectSoldier}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Please select soldier to update"
                            variant="outlined"
                            >
                            {this.soldierInCommanderMajor.map((sld) => (
                                    <option key={sld.personalId} value={sld.personalId}>
                                    {
                                    "Personal id: "  + sld.personalId + " | First name: " + sld.firstName 
                                    + " | Last name: " + sld.lastName + " "
                                    }
                                    </option>
                            ))}

                        </TextField>


                            <Button
                                        onClick={this.updateUserInfo}
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<SaveIcon />}>
                                        Update user info !!!
                                            
                            </Button>


                            <div id="form-based-on-selected user">
                                    {
                                    // if view - true -> render this.form o.w. -> render ''
                                    (this.state._selected) 
                                    ? this.form
                                    
                                    : ''
                                    }
                                                    {
                                    // if view - true -> render this.form o.w. -> render ''
                                    (this.state._error) 
                                    ? this.form
                                    
                                    : ''
                                    }
                            </div>
                        

                                <div>
                                    
                                {
                                    // if view - true -> render this.form o.w. -> render ''
                                    (this.state._selected) 
                                    ?
                                    <ChangeUserData 
                                    prev_phone_number={this.soldier_phone}
                                    prev_lastName = {this.soldier_secondName}
                                    prev_firstName = {this.soldier_firstName}
                                    prev_username = {this.soldier_username} >       
                                    </ChangeUserData>
                                    
                                    : ''
                                    }
                                                    {
                                    // if view - true -> render this.form o.w. -> render ''
                                    (this.state._error) 
                                    ?
                                    this.form
                                    
                  
                                    
                                    : ''
                                    }

                                </div>
                        
                        
                        
                        </div>
                        
                        
            
                        
                    }>

                    </MenuAppBar>
                );
        }
        else {
            return (
                
                <MenuAppBar 
                    menu={
                        <CommanderMenu/>
                    }>
                        
                </MenuAppBar>
            )
        }
    }
}









export default withStyles(useStyles, { withTheme: true })(UpdateUsers);