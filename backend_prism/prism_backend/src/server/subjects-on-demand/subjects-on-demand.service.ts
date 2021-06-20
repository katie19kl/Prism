import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MajorManager } from '../file-handling/managers/MajorManager';
import { ModuleManager } from '../file-handling/managers/ModuleManager';
import { SubjectManager } from '../file-handling/managers/SubjectManager';
import { Major } from '../users/common/major.enum';
import { UsersService } from '../users/users.service';
import { CreateSubjectsOnDemandDto } from './dto/subjects-on-demand.dto';
import { ISubjectsOnDemand } from './subjects-on-demand.interface';

@Injectable()
export class SubjectsOnDemandService {

    

	moduleManager: ModuleManager
    majorManager: MajorManager


    constructor(@InjectModel('SubjectsOnDemand') private userSubmissionModel: Model<ISubjectsOnDemand>){
	

		this.moduleManager = new ModuleManager()
        this.majorManager = new MajorManager()

    }





    // close all subjects to specific soldier
    async closeAllSubjectToNewSoldier(majors: Major[], soldierId:string){
        
        
        for (const major of majors){
			
			let modules = await this.majorManager.getAllDirOfMajor(major)
			for (const module of modules){
		
				let subjects = await this.moduleManager.getAllDirOfModule(major, module)
                for (const subject of subjects){
                    

                    await this.closeNewSubjectToSoldier(major, module, subject, soldierId)
	
                }
			}
		}
        
    }

    // From creating new subject -> close to all soldiers
    async closeNewSubjectToAllSoldier(major_:Major, module:string, subject:string){

        let allSoldiers = []
        for (const soldier of allSoldiers){

            let soldierId = soldier["personalId"]            
            await this.closeNewSubjectToSoldier(major_, module,subject, soldierId) 
        
        }
    }


    // closing subject to specific user
    async closeNewSubjectToSoldier(major_:Major, module:string, subject:string, soldierId_:string){

        // get all soldiers by major
  
        const filter_ = {soldierId : soldierId_, major: major_}


        let foundObject = await this.userSubmissionModel.findOneAndDelete(filter_)
        
       
        
        // was found - delete & store ( updating )
        if (foundObject){
            
            console.log("1")
            
            // add another subject to module-subject list
            if (foundObject.moduleToClosedSubjects.has(module)){
                foundObject.moduleToClosedSubjects.get(module).push(subject)
            }else {
                // create arr with one element
                let arr = []
                arr.push(subject)
                foundObject.moduleToClosedSubjects.set(module, arr) 
            }


            // opened subject should be empty array
            if (foundObject.moduleToOpenedSubjects.has(module)){

            }else {
                let arr = []
                foundObject.moduleToOpenedSubjects.set(module, arr) 
            }


            // create dto with above fields to save it
            let newObject = new CreateSubjectsOnDemandDto()
            
            newObject.major = foundObject.major
            newObject.soldierId = foundObject.soldierId
            newObject.moduleToOpenedSubjects = foundObject.moduleToOpenedSubjects
            newObject.moduleToClosedSubjects = foundObject.moduleToClosedSubjects
            
            let toSave = new this.userSubmissionModel(newObject);
    
            //console.log(newObject)
            await toSave.save()



        }// It is the first subject of user ( in module )
        else {

            console.log("2")
            
            // create the very first document of user
            let newObject = new CreateSubjectsOnDemandDto()
            
            newObject.soldierId = soldierId_
            newObject.major = major_


            // open is empty arr
            let mapModuleToOpenedSubjects = new Map()
            mapModuleToOpenedSubjects.set(module, [])
            newObject.moduleToOpenedSubjects = mapModuleToOpenedSubjects


            // closed contains exactly one new-subject
            let closedSubjects = []
            closedSubjects.push(subject)
            
            let mapModuleToClosedSubjects = new Map()
            mapModuleToClosedSubjects.set(module, closedSubjects)

            newObject.moduleToClosedSubjects = mapModuleToClosedSubjects



            let toSave = new this.userSubmissionModel(newObject);
    
            //console.log(newObject)
            await toSave.save()
        }

       

    }

    



    async openNewSubjectToSoldier(major:Major, module:string, subject:string, personalId:string){

        const filter_ = {soldierId : personalId, major: major}


        let foundObject = await this.userSubmissionModel.findOne(filter_)
        
        foundObject.moduleToOpenedSubjects[module].push(subject)


       // console.log("-----------OPENED----------")
       // console.log(foundObject.moduleToOpenedSubjects)
       // console.log("-----------------------------")

    }
    


    
}
