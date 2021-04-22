import { Major } from "src/server/users/common/major.enum";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

export class SubjectManager{


    createPathToModule(major,module){
        let pathToModule = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        return pathToModule
    }

    async getLastIndexOfSubject(pathToModule){

        console.log(pathToModule)
        const fs = require('fs');

        let all_subjects = []

        await new Promise ((resolve, reject) => {
            fs.readdir(pathToModule, async (err, files) => {
                        
                        
                if (err) {
                    reject(err);
                }
                for await(const file of files){
                    const stat = await fs.promises.stat( pathToModule + "/" + file);
                    if (await stat.isDirectory()) {
                        all_subjects.push(file)
                    }
                }
            
                resolve(files)
            });
        })

        console.log(all_subjects)
        
        let amount = all_subjects.length

        return amount
        
    }
    createSubjectPathDir(major:Major,module: string,newNameSubject: string, new_index:string){

        let indexModule = module[0]
        let pathMajorModelSubject = FileHandlingService.pathRootDirectory + "/" + major + '/'  + module+ "/"+ indexModule + IndexingFormat.SubjectSubIndexing + new_index + IndexingFormat.SubjectSeparator + newNameSubject
        return pathMajorModelSubject
    }

    async createNewSubject(major:Major,module: string,newNameSubject: string)
    {   
 
        let pathToModule = this.createPathToModule(major,module)
        console.log("-*-*-*-*-*")

        let lastSubjectIndex = await this.getLastIndexOfSubject(pathToModule)
        
        let newIndex = (lastSubjectIndex + 1).toString()

        
        let dirPath = this.createSubjectPathDir(major,module,newNameSubject,newIndex)

        console.log(dirPath)
        await FileHandlingService.createNewDir(dirPath)
        
    }


    concateSubjectPath(major:Major, module:string, subjectToDelete:string){
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" +  module + "/" + subjectToDelete
        return path
    }


    extractIndexOfSubject(subjectToDelete){
        let splittedIndexing = subjectToDelete.split(IndexingFormat.SubjectSubIndexing)
        
        let subjectIndex = splittedIndexing[1][0] 
        
        return subjectIndex
    }



    async decreaseIndexesSubjectAfterRemoved(removedIndex:string, major:Major, module:string){
        
        const fs = require("fs")
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        
        let all_dirs = FileHandlingService.getDirList(path)
        console.log(all_dirs)


        
        
        for await (const dir of all_dirs) {
         
            let index_dir = this.extractIndexOfSubject(dir)
   
            if (parseInt(index_dir) > parseInt(removedIndex)) {

                console.log(dir)

                let currentPath = path + "/" + dir;
                let index_new = parseInt(dir[2]) - 1
                let dirNew = dir.replace(dir[2], index_new.toString());
                let newPath = path + "/" + dirNew
/*
                console.log("new path -- " + newPath);
                console.log("prev path -- " + currentPath);
                console.log("=========");*/
                
                fs.rename(currentPath, newPath, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Successfully renamed the directory.")
                    }
                })
            }
        }


    }
    




    async removeSubject(major: Major, module: string, subjectToDelete: string) {


        //let dir = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_to_del
        let dir = this.concateSubjectPath(major, module, subjectToDelete)
        console.log(dir)
        const fs = require("fs")

        let indexToRemove = this.extractIndexOfSubject(subjectToDelete)
        console.log(indexToRemove)

        console.log(" before rem")

        await fs.rmdir(dir, { recursive: true }, (err) => {
            console.log(dir)
            if (err) {

                console.log(err)
                throw err;
            }

            console.log(`${dir} is deleted!`);

            console.log(" after rem")


            this.decreaseIndexesSubjectAfterRemoved(indexToRemove, major, module)
        });

    }



}