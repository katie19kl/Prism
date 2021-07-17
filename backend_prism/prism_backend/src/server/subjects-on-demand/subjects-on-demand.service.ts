import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MajorManager } from '../file-handling/managers/MajorManager';
import { ModuleManager } from '../file-handling/managers/ModuleManager';
import { Major } from '../users/common/major.enum';
import { CreateSubjectsOnDemandDto } from './dto/subjects-on-demand.dto';
import { ISubjectsOnDemand } from './subjects-on-demand.interface';


@Injectable()
export class SubjectsOnDemandService {

    moduleManager: ModuleManager;
    majorManager: MajorManager;


    constructor(@InjectModel('SubjectsOnDemand') private userSubmissionModel: Model<ISubjectsOnDemand>) {

        this.moduleManager = new ModuleManager();
        this.majorManager = new MajorManager();
    }


    async getSoldierOpened(personalId: string) {
        const filter_ = { soldierId: personalId };

        return await this.userSubmissionModel.find(filter_);
    }


    // close all subjects to specific soldier
    async closeAllSubjectToNewSoldier(majors: Major[], soldierId: string) {

        if (majors !== undefined) {

            for (const major of majors) {

                let modules = await this.majorManager.getAllDirOfMajor(major);
                for (const module of modules) {

                    let subjects = await this.moduleManager.getAllDirOfModule(major, module);
                    for (const subject of subjects) {

                        await this.closeNewSubjectToSoldier(major, module, subject, soldierId);
                    }
                }
            }
        }
    }


    // From creating new subject -> close to all soldiers
    async closeNewSubjectToAllSoldier(major_: Major, module: string, subject: string) {

        let allSoldiers = [];
        for (const soldier of allSoldiers) {

            let soldierId = soldier["personalId"];
            await this.closeNewSubjectToSoldier(major_, module, subject, soldierId);
        }
    }


    // closing subject to specific user
    async closeNewSubjectToSoldier(major_: Major, module: string, subject: string, soldierId_: string) {

        // get all soldiers by major
        const filter_ = { soldierId: soldierId_, major: major_ };
        let foundObject = await this.userSubmissionModel.findOneAndDelete(filter_);

        // was found - delete & store ( updating )
        if (foundObject) {

            // add another subject to module-subject list
            if (foundObject.moduleToClosedSubjects.has(module)) {
                foundObject.moduleToClosedSubjects.get(module).push(subject);

            } else {

                // create arr with one element
                let arr = [];
                arr.push(subject);
                foundObject.moduleToClosedSubjects.set(module, arr);
            }

            // opened subject should be empty array
            if (foundObject.moduleToOpenedSubjects.has(module)) {
                // empty.
            } else {
                let arr = [];
                foundObject.moduleToOpenedSubjects.set(module, arr);
            }

            // create dto with above fields to save it
            let newObject = new CreateSubjectsOnDemandDto();

            newObject.major = foundObject.major;
            newObject.soldierId = foundObject.soldierId;
            newObject.moduleToOpenedSubjects = foundObject.moduleToOpenedSubjects;
            newObject.moduleToClosedSubjects = foundObject.moduleToClosedSubjects;
            let toSave = new this.userSubmissionModel(newObject);

            await toSave.save();

        } // It is the first subject of user ( in module )
        else {

            // create the very first document of user
            let newObject = new CreateSubjectsOnDemandDto();

            newObject.soldierId = soldierId_;
            newObject.major = major_;

            // open is empty arr
            let mapModuleToOpenedSubjects = new Map();
            mapModuleToOpenedSubjects.set(module, []);
            newObject.moduleToOpenedSubjects = mapModuleToOpenedSubjects;

            // closed contains exactly one new-subject
            let closedSubjects = [];
            closedSubjects.push(subject);

            let mapModuleToClosedSubjects = new Map();
            mapModuleToClosedSubjects.set(module, closedSubjects);
            newObject.moduleToClosedSubjects = mapModuleToClosedSubjects;

            let toSave = new this.userSubmissionModel(newObject);
            await toSave.save();
        }
    }


    // helper function
    arrayRemove(arr, value) {

        return arr.filter(function (ele) {
            return ele != value;
        });
    }


    async openNewSubjectToSoldier(major: Major, module: string, subject: string, personalId: string) {

        const filter_ = { soldierId: personalId, major: major };

        // find submision
        let foundObject = await this.userSubmissionModel.findOne(filter_);

        // extract opened subjects (dictionary)
        let openedSubjects = foundObject.moduleToOpenedSubjects.get(module);
        
        // add new one
        openedSubjects.push(subject);

        let updatedOpenedSubjects = openedSubjects;

        // delete from closed subjects 
        let closedSubjects = foundObject.moduleToClosedSubjects.get(module);
        let updatedClosedSubjects = this.arrayRemove(closedSubjects, subject);
        let updateOpenedMap = foundObject.moduleToOpenedSubjects;

        updateOpenedMap.set(module, updatedOpenedSubjects);

        let updatedClosedMap = foundObject.moduleToClosedSubjects;
        updatedClosedMap.set(module, updatedClosedSubjects);

        // restore the above changes
        return await this.userSubmissionModel.updateOne(filter_, {
            moduleToOpenedSubjects: updateOpenedMap,
            moduleToClosedSubjects: updatedClosedMap,
        });
    }


    async closeSubjectToSoldier(major: Major, module: string, subject: string, personalId: string) {

        const filter_ = { soldierId: personalId, major: major };
        let foundObject = await this.userSubmissionModel.findOne(filter_);

        // add new subject to closed
        let closedMap = foundObject.moduleToClosedSubjects;
        let closedModule = closedMap.get(module);

        closedModule.push(subject);
        closedMap.set(module, closedModule);

        let updatedClosedMap = closedMap;
        
        // updated closed subjects
        let openedMap = foundObject.moduleToOpenedSubjects;
        let openedModule = openedMap.get(module);

        let updatedModule = this.arrayRemove(openedModule, subject);

        openedMap.set(module, updatedModule);

        let updatedOpenedMap = openedMap;

        // update fields
        return await this.userSubmissionModel.updateOne(filter_, {
            moduleToOpenedSubjects: updatedOpenedMap,
            moduleToClosedSubjects: updatedClosedMap,
        });
    }


    getFirstProp(jsonObj) {
        let firstProp;

        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                firstProp = jsonObj[key];
                break;
            }
        }
        return firstProp;
    }


    async getSoldiersClosedSubjects(major: Major, module: string, soldiers_) {
        let soldiers = this.getFirstProp(soldiers_);

        let soldiersClosed = {};
        for (const soldier of soldiers) {

            let closedSubjects = await this.getSoldierClosedSubjects(major, module, soldier.personalId);
            soldiersClosed[soldier.personalId] = closedSubjects;
        }

        return soldiersClosed;
    }


    async getSoldierClosedSubjects(major: Major, module: string, personalId: string) {

        const filter_ = { soldierId: personalId, major: major };

        return (await this.userSubmissionModel.findOne(filter_)).moduleToClosedSubjects.get(module);
    }


    async getSoldierOpenedSubjects(major: Major, module_: string, personalId: string) {

        const filter_ = { soldierId: personalId, major: major };
        return (await this.userSubmissionModel.findOne(filter_)).moduleToOpenedSubjects.get(module_);
    }
}
