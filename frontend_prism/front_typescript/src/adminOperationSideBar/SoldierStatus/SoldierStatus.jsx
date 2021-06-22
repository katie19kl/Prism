
import React from "react"
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu"
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar"
import Role from "../../Roles/Role"
import SoldierStatusFrame from "./SoldierStatusFrame"




export default class SoldierStatus extends React.Component {


    render(){



        return ( 
            <MenuAppBar 
            menu={
                <CommanderMenu/>
            } 
            
            role={Role.Commander}
			content={
               
                <SoldierStatusFrame>

                </SoldierStatusFrame>
                
                
            }>

            </MenuAppBar>
        )
 
   
    }

}
