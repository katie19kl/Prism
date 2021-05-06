import React from "react"

import MenuAppBar from "./../../GeneralComponent/main/MenuAppBar"
import SoldierMenu from "./../../GeneralComponent/soldier/SoldierMenu"


export default class UserSubmission extends React.Component {


    render(){

        let moduleName = this.props.match.params.moduleName
        let major = this.props.match.params.major
        let subject = this.props.match.params.subject 


        return (
 
            <MenuAppBar
            role = "Soldier" 
            menu={
                <SoldierMenu/>
            }
            content={
                
                <div>
                    <h2> Submission info</h2>
                    
                    <h2> {major}</h2>
                    
                    <h2> {moduleName}</h2>
                    
                    <h2> {subject}</h2>
                </div>
            }
            >


            </MenuAppBar>
 
        )
    }

}