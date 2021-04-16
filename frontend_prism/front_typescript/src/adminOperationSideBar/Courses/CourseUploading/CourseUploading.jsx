import React from "react"

import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";

import UploadTryBAR from "../CourseUploading/UploadTryBAR"
import "bootstrap/dist/css/bootstrap.min.css";
import ModulesDisplaying from "./ModulesDisplaying";

class CourseUploading  extends React.Component {



	render() {
        return (
            <MenuAppBar 
            menu={
                <CommanderMenu/>
            }
            content={
                <div>
                    <ModulesDisplaying/>  

                    <br></br>
                    <br></br>
                    <br></br>
                    <h2> uploading Second  here </h2>
                    {/*<UploadTryBAR/>*/}
               </div>
            }>

            </MenuAppBar>

        )
    }

}
	
export default CourseUploading;