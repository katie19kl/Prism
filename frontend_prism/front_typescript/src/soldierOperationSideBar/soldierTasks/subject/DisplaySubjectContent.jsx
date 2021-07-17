import React from "react"
import DisplayFiles from "../../../adminOperationSideBar/Courses/CourseDisplaying/DisplayFiles";
import { Status } from "../../../GeneralComponent/SubmissionStatusColors/SoldierSubmissionStatus";
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


        let existSubmission = this.props.reviewedSubjects.includes(subject)

        for (let i = 0; i< filteredArrFiles.length; i = i + 1){
            let idFile = filteredArrFiles[i].file_name.split("_")[0]
            
            if (idFile === personalId && existSubmission){
                filteredArrFiles[i].file_name = Status.Reviewed
            } 
        }
        
        
        return (

            <div>
                <DisplayFiles files={filteredArrFiles} role={Role.Soldier} reviewedSubjects={this.props.reviewedSubjects}/>
        
            </div>

        );
    }
}
