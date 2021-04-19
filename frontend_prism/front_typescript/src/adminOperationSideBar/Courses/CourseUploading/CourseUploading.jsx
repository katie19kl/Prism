import React from "react"
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import "bootstrap/dist/css/bootstrap.min.css";
import UploadBar from './UploadBar';

class CourseUploading  extends React.Component {

	render() {
        return (
            <MenuAppBar 
            menu={
                <CommanderMenu/>
            }
            content={
                <div>
                 

                    <br></br>
                    <br></br>
                    <br></br>
                    <h2> uploading Second  here </h2>
                    {<UploadBar/>}
               </div>
            }>

            </MenuAppBar>

        )
    }

}
	
export default CourseUploading;