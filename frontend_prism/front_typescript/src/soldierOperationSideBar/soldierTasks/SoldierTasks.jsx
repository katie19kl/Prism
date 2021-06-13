import React from "react"
import MenuAppBar from "./../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../GeneralComponent/soldier/SoldierMenu"

import {getUserInfoByJWT } from './../../HelperJS/extract_info'
import DisplayModules from "./module/DisplayModules"


export default class SoldierTasks extends React.Component {

    constructor(props) {
		super(props);
        this.state = {
			user: undefined
        }
    }


    componentDidMount() {
        console.log("000")
        if (this.state.user === undefined){
            
            getUserInfoByJWT().then((user_) => {
                console.log("444")
                if (user_ === undefined){
                    
                } else {

                    console.log("here user was given")
                    user_ = user_.data
                    
                    console.log(user_)
                    /*
                    let username_ = user["username"]
                    let majors_ = user["major"]
                    let role_ = user["role"]
                    let firstName_ = user["firstName"]
                    let lastName_ = user["lastName"]
                    let phoneNum = user["phoneNumber"]
                    let gender_ = user["gender"]
                    */

                    this.setState({
                                        
                        user:user_
                    })
                    

                }
            })
        }
    }



	render() {
        console.log("====================================")
        let user = this.state.user;
        console.log(user)
        console.log("====================================")
        
        if (user === undefined){
            console.log("11")
            return (
                        <MenuAppBar
                            role = "Soldier" 
                            menu={
                                <SoldierMenu/>
                            }>

                        </MenuAppBar>
            )
        }
        else {
            console.log("22")
            
            console.log(user)
            
            console.log("22")
            
            return (
                <div>
                    <MenuAppBar
                        role = "Soldier" 
                        menu={
                            <SoldierMenu/>
                        }
                        content={
                            <div>
                                <DisplayModules user = {user}>
                                    
                                </DisplayModules>
                                
                            </div>
                        }>
                            
                    </MenuAppBar>
                </div>
            );
        }
	}
}

