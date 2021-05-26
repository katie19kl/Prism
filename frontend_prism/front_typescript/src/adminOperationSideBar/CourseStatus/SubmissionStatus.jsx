
import React from "react"
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu"
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar"
import Role from "../../Roles/Role"
import TableStatusFrame from "./TableStatusFrame"




export default class SubmissionStatus extends React.Component {


    render(){



        return ( 
            <MenuAppBar 
            menu={
                <CommanderMenu/>
            } 
            
            role={Role.Commander}
			content={
               
                <TableStatusFrame/>
         
                
                
            }>

            </MenuAppBar>
        )
 
   
    }

}
