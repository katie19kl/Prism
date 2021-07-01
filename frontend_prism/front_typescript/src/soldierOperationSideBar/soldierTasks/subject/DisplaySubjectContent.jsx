import React from "react"
import DisplayFiles from "../../../adminOperationSideBar/Courses/CourseDisplaying/DisplayFiles";
import Role from "../../../Roles/Role";

export default class DisplaySubjectContent extends React.Component {



    removeOtherSoldierFiles(arrFiles,personalId) {

        let filteredArr = [];
        for (let file of arrFiles) {
            let idFile = file.file_name.split("_")[0];
            let isAnotherSolution = (file.file_name.split("_")[1] === "solution");
           
            if (!(idFile === personalId) && isAnotherSolution) {
                // do nothing.
            } else {
                filteredArr.push(file);
            }
        }
        return filteredArr;

    }

    render() {

        let subject = this.props.subject;
        let dictSubjectFiles = this.props.dictSubjectFiles;

        let arrFiles = dictSubjectFiles[subject];
        
        let personalId = this.props.personalId;

        let filteredArrFiles = [];
        
        // if there is no files yet 
        if (arrFiles.length === 0) {
            // do nothing.
        } else {
            filteredArrFiles = this.removeOtherSoldierFiles(arrFiles, personalId);
        }
        
        return (

            <div>
                <DisplayFiles files={filteredArrFiles} role={Role.Soldier} />
        
            </div>

        );
    }
}
