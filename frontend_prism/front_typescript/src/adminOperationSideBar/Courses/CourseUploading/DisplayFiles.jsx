import React from "react"
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import "bootstrap/dist/css/bootstrap.min.css";
import UploadBar from './UploadBar';
import getListOfAllFiles from './file_handle'


class DisplayFiles  extends React.Component {

	render() {


        let fileInfos = this.props.files
        if (fileInfos === undefined){
            fileInfos = []
        }


        return (
            <div>
                <h2> files are</h2>
                <br></br>
                <h2>--------------</h2>
            
            
                <div className="card">
                    
                    <div className="card-header">List of Files</div>
                    
                    <ul className="list-group list-group-flush">
                        {fileInfos !== [] &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                            <a href={file.url}>{file.file_name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            
            
            
            </div>

        )
    }

}
	
export default DisplayFiles;