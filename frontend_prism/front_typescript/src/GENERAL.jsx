import React from "react"

import CustomCalendar from "./GeneralComponent/commonGeneral/CustomCalendar"
import CustomClock from "./GeneralComponent/commonGeneral/CustomClock"

import CommanderMenu from "./GeneralComponent/admin/CommanderMenu"
import MenuAppBar from "./GeneralComponent/main/MenuAppBar"
import Role from "./Roles/Role";


export default class General extends React.Component {



    render() {
      return (

        <MenuAppBar 
        menu={
            <CommanderMenu/>
        } 
        
        role={Role.Commander}
        content={
           
            <div>
                <CustomCalendar/>

                <CustomClock/>
            </div>
        }>

        </MenuAppBar>


      );
    }
  }