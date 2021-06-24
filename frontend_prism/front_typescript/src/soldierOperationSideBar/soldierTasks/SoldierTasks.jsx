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
 

                    this.setState({
                                        
                        user:user_
                    })
                    

                }
            })
        }
    }

	render() {
        let user = this.state.user;
        
        if (user === undefined) {

            return (
                <MenuAppBar
                    role = "Soldier" 
                    menu={
                        <SoldierMenu/>
                    }>

                </MenuAppBar>
            );
        }
        else {            
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
