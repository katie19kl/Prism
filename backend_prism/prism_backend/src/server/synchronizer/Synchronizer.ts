import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rename } from 'node:fs';
import { IndexingFormat } from '../file-handling/common/IndexingFormat';
import { IReview } from '../review/ireview.interface';
import { ISubjectsOnDemand } from '../subjects-on-demand/subjects-on-demand.interface';
import { Major } from '../users/common/major.enum';
import { IUserSubmission } from '../UserSubmission/iuser-submission.interface';


@Injectable()
export class Synchronizer {

	
    constructor(     
        @InjectModel('SubjectsOnDemand') private subjectOnDemandModel: Model<ISubjectsOnDemand>,
        @InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>,
        @InjectModel('Reviews') private reviewsModel: Model<IReview>,) {}


    private async deleteSubmissionsByFilter(filter){
        await this.userSubmissionModel.deleteMany(filter)
    }

    private async deleteReviewsByFilter(filter){
        await this.reviewsModel.deleteMany(filter)
    }

    private async deleteSubjectOnDemands(filter){
        await this.subjectOnDemandModel.deleteOne(filter)
    }


    // Delete all submissions && reviews with deleted 
    // personalId && one document in subject on demand
    async syncUserDeletion(soldierDeletedId:String){

        await this.deleteSubmissionsByFilter({soldierId:soldierDeletedId})
        await this.deleteReviewsByFilter({soldierId:soldierDeletedId})
        return await this.deleteSubjectOnDemands({soldierId:soldierDeletedId})
        
    }







    private async updateReviews(filter, newVal){
        await this.reviewsModel.updateMany(filter, newVal)
    }

    private async updateSubmissions(filter, newVal){
        await this.userSubmissionModel.updateMany(filter,newVal)
    }

    private async subjectRenamingSubjectOnDemand(major:Major, module,prevSubjectName:string, newSubjectName:string){
        
        let foundObjects = await this.subjectOnDemandModel.find({major:major})
        
        
        
        
        for (const element of foundObjects){
        
            
            console.log(">>>>>>>>>>>>>>>>>>>>>")
            console.log(element)
            console.log("<<<<<<<<<<<<<<<<<<<<<")
    


            let arrSubjectsClosed = element.moduleToClosedSubjects.get(module)
            if (arrSubjectsClosed.includes(prevSubjectName)){

                let newArr = []
                for (const subject of arrSubjectsClosed){
                    if (subject == prevSubjectName){
                        newArr.push(newSubjectName)
                    }else {
                        newArr.push(subject)
                    }
                }
                
                newArr.sort()
                element.moduleToClosedSubjects.set(module, newArr)
            }


            let arrSubjectsOpened = element.moduleToOpenedSubjects.get(module)
            if (arrSubjectsOpened.includes(prevSubjectName)){

                let newArr = []
                for (const subject of arrSubjectsOpened){
                    if (subject == prevSubjectName){
                        newArr.push(newSubjectName)
                    }else {
                        newArr.push(subject)
                    }
                }
                newArr.sort()
                element.moduleToOpenedSubjects.set(module, newArr)
            }

            let filterToUpdate = {soldierId:element.soldierId, major: element.major}
            let newVal = {moduleToOpenedSubjects: element.moduleToOpenedSubjects,
                            moduleToClosedSubjects: element.moduleToClosedSubjects}

            await this.subjectOnDemandModel.updateOne(filterToUpdate, newVal)


            console.log("|||||||||||||||||")
            console.log(newVal)
            console.log("|||||||||||||||||")
    
        }
    }

    //	update all reviews 
    //	update all users submissions	
	//  update all subjects per demand
    async syncSubjectRenaming(major_:Major,module_:string, prevSubjectName:string, newSubjectName:string){
       
         
        console.log("IN syncronizer ----------subject renaming")
        console.log("major " + major_)
        console.log("module " + module_)
        console.log("prev subject " + prevSubjectName)
        console.log("new subject " + newSubjectName)
        console.log("-----------------------------------------")


        let filter = {major:major_, module:module_ ,subject:prevSubjectName}
        let newVal = {subject:newSubjectName}

        await this.updateReviews(filter,newVal)
        await this.updateSubmissions(filter,newVal)
        return await this.subjectRenamingSubjectOnDemand(major_, module_,prevSubjectName,newSubjectName)
    }


    



    // delete all reviews
    // delete all user_submissions
    // update subjectOnDemand

    private async deleteSubjectFromPerDemand(major_:Major, module_:string, removedSubject:string){
    
        let foundObjects = await this.subjectOnDemandModel.find({major:major_})
        for (const object of foundObjects){
            //console.log("================================================")
            //console.log(object)

            let moduleOpenSubjects = object.moduleToOpenedSubjects.get(module_)
            if (moduleOpenSubjects.includes(removedSubject)){
                let newModuleOpenedSub = []
                for (const subject of moduleOpenSubjects){
                    if (subject !== removedSubject){
                        newModuleOpenedSub.push(subject)
                    }
                }
                newModuleOpenedSub.sort()
                object.moduleToOpenedSubjects.set(module_, newModuleOpenedSub)
            }

            

            let moduleClosedSubjects = object.moduleToClosedSubjects.get(module_)
            if (moduleClosedSubjects.includes(removedSubject)){
                let newModuleClosedSub = []
                for (const subject of moduleClosedSubjects){
                    if (subject !== removedSubject){
                        newModuleClosedSub.push(subject)
                    }
                }
                newModuleClosedSub.sort()
                object.moduleToClosedSubjects.set(module_, newModuleClosedSub)
            }

            let filterToUpdate = {soldierId:object.soldierId, major: object.major}
            let newVal = {moduleToOpenedSubjects: object.moduleToOpenedSubjects,
                            moduleToClosedSubjects: object.moduleToClosedSubjects}

            
            console.log(newVal)

                
            await this.subjectOnDemandModel.updateOne(filterToUpdate, newVal)
        }

        
    }


    async syncSubjectRemoving(major_:Major, module_:string, removedSubject:string){

        console.log("----------Sync removing subject-----------")
        let filter = {major:major_, module: module_, subject:removedSubject}
        console.log(filter)
        console.log("------------------------------------------")


        await this.deleteReviewsByFilter(filter)
        await this.deleteSubmissionsByFilter(filter)
        return await this.deleteSubjectFromPerDemand(major_,module_,removedSubject)
    }


    private async renameModuleInSubjectDemand(major_:Major, prevModuleName:string,newModuleName:string){
        
        console.log("------ module renaming in subject on demand -------")

        let foundObjects = await this.subjectOnDemandModel.find({major:major_})

        for (const object of foundObjects){

            
            let openedMap = object.moduleToOpenedSubjects
            if (openedMap.has(prevModuleName)){

                let updatedOpenMap = new Map()

                for (const [key, value] of openedMap.entries()) {
                    if (key === prevModuleName){
                        updatedOpenMap.set(newModuleName, value)
                    }else {
                        updatedOpenMap.set(key, value)
                    }
                    
                }

                object.moduleToOpenedSubjects = updatedOpenMap
            }



            let closedMap = object.moduleToClosedSubjects
            if (closedMap.has(prevModuleName)){

                let updatedClosedMap = new Map()

                for (const [key, value] of closedMap.entries()) {
                    if (key === prevModuleName){
                        updatedClosedMap.set(newModuleName, value)
                    }else {
                        updatedClosedMap.set(key, value)
                    }
                    
                }

                object.moduleToClosedSubjects = updatedClosedMap
            }


            let filterToUpdate = {soldierId:object.soldierId, major: object.major}
            let newVal = {moduleToOpenedSubjects: object.moduleToOpenedSubjects,
                            moduleToClosedSubjects: object.moduleToClosedSubjects}

            
            //console.log(newVal)

            //console.log(object)  
            await this.subjectOnDemandModel.updateOne(filterToUpdate, newVal)

        }
        
    
    }



    async syncModuleRenaming(major_:Major, prevModuleName:string,newModuleName:string){
        console.log(".... Module renaming sync ...")
        console.log("prev", prevModuleName)
        console.log("curr", newModuleName)

        let filter = {major:major_, module: prevModuleName}
        let newVal = {module:newModuleName}
        await this.updateReviews(filter,newVal)
        await this.updateSubmissions(filter,newVal)
        return await this.renameModuleInSubjectDemand(major_, prevModuleName,newModuleName )

    }

    private async deleteModuleFromSubjectDemand(major_: Major, moduleToDelete:string){
        console.log("------ module deleting in subject on demand -------")
    

        let foundObjects = await this.subjectOnDemandModel.find({major:major_})

        for (const object of foundObjects){

            
            let openedMap = object.moduleToOpenedSubjects
            if (openedMap.has(moduleToDelete)){

                let updatedOpenMap = new Map()

                for (const [key, value] of openedMap.entries()) {
                    if (key === moduleToDelete){
                        
                    }else {
                        updatedOpenMap.set(key, value)
                    }
                    
                }

                object.moduleToOpenedSubjects = updatedOpenMap
            }



            let closedMap = object.moduleToClosedSubjects
            if (closedMap.has(moduleToDelete)){

                let updatedClosedMap = new Map()

                for (const [key, value] of closedMap.entries()) {
                    if (key === moduleToDelete){
                        
                    }else {
                        updatedClosedMap.set(key, value)
                    }
                    
                }

                object.moduleToClosedSubjects = updatedClosedMap
            }


            let filterToUpdate = {soldierId:object.soldierId, major: object.major}
            let newVal = {moduleToOpenedSubjects: object.moduleToOpenedSubjects,
                            moduleToClosedSubjects: object.moduleToClosedSubjects}

            
            //console.log(newVal)

            //console.log(object)  
            await this.subjectOnDemandModel.updateOne(filterToUpdate, newVal)

        }
    }

    async syncModuleDeleting(major_: Major, moduleToDelete:string){
        console.log(" module deleting syncronizing ")
        console.log(" module to delete ", moduleToDelete)
        let filter = {major:major_, module: moduleToDelete}
        await this.deleteReviewsByFilter(filter)
        await this.deleteSubmissionsByFilter(filter)
        return await this.deleteModuleFromSubjectDemand(major_,moduleToDelete)


    }



}
