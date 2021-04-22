import { Major } from "src/server/users/common/major.enum";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

export class ModuleManager {

    async removeModuleDirInMajor(module_to_del: string, major: Major) {

        //let dir = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_to_del
        let dir = this.createPathMajorModuleGivenIndexing(major, module_to_del)
        console.log(dir)
        const fs = require("fs")

        console.log(" before rem")
        await fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {

                console.log(err)
                throw err;
            }

            console.log(`${dir} is deleted!`);

            console.log(" after rem")
            let removedIndex = module_to_del[0]
    
            this.decreaseIndexesModulesAfterRemoved(removedIndex, major)
        });




    }
    
    createPathMajorModuleGivenIndexing(major: Major, module: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module;
        return pathMajor;
    }


    async getAllDirOfModule(major: Major, module: string) {
        let fullPath = this.createPathMajorModuleGivenIndexing(major, module);

        return FileHandlingService.getDirList(fullPath);
    }


    async decreaseIndexesModulesAfterRemoved(removedIndex, major: Major) {

        const fs = require("fs")
        //let path = FileHandlingService.pathRootDirectory + "/" + major
        let path = this.createPathMajor(major)
        let all_dirs = FileHandlingService.getDirList(path)
        console.log(all_dirs)


        for await (const dir of all_dirs) {

            let index_dir = parseInt(dir[0])
            if (index_dir > removedIndex) {
                console.log(dir)

                let currentPath = path + "/" + dir;
                let index_new = parseInt(dir[0]) - 1
                let dirNew = dir.replace(dir[0], index_new.toString());
                let newPath = path + "/" + dirNew

                console.log(newPath);
                console.log(currentPath);
                console.log("=========");

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


    createPathMajor(major: Major) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major
        return pathMajor;
    }




    async getIndexOfLastModule(major: Major) {

        let fs = require('fs');
        let dirMajor = FileHandlingService.pathRootDirectory + "/" + major

        console.log(dirMajor)


        let dirs_in_major: any[] = await new Promise((resolve, reject) => {

            let dirs = []
            fs.readdir(dirMajor, async (err, files) => {

                if (err) {
                    reject(err);
                }
                for await (const file of files) {
                    const stat = await fs.promises.stat(dirMajor + "/" + file);
                    if (await stat.isDirectory()) {
                        dirs.push[file];
                    }
                }
                resolve(files)
            });
        })
        console.log(dirs_in_major)
        console.log("!@!@!@!@!!@!@")

        let amount_modules = 0
        for (const foo of dirs_in_major) {
            amount_modules = amount_modules + 1
        }
        console.log(amount_modules)
        return amount_modules



    }

    // creates directory in major level
    async createNewModuleDirInMajor(new_directory_name: string, major: Major) {
        let lastIndex = await this.getIndexOfLastModule(major) + 1
        let pathMajor = this.createPathMajor(major)
        let pathModuleNew = this.createPathMajorModule(lastIndex.toString(), pathMajor, new_directory_name)
        console.log(pathModuleNew)
        await FileHandlingService.createNewDir(pathModuleNew)

    }


   


    //composes root/major/model of given module index
    createPathMajorModule(module_index: string, pathMajor, new_module: string) {


        let dirsInMajor = FileHandlingService.getDirList(pathMajor)
        console.log(dirsInMajor)
        console.log("==========")

        let nameOfIndexedDir = this.getNameOfIndexedDirModule(dirsInMajor, module_index);
        console.log(nameOfIndexedDir);


        let pathMajorModel = pathMajor + "/" + module_index + IndexingFormat.ModuleSeparator + new_module;
        return pathMajorModel;

    }

    // given list of all dirs in some module path
    // return name with given index
    getNameOfIndexedDirModule(dirsInMajor, module_index: String) {

        let index = '';
        let nameOfIndex = '';

        for (let dir of dirsInMajor) {
            let tokenedDir = dir.split(IndexingFormat.ModuleSeparator)
            // parse dir index & name
            if (tokenedDir.length == 2) {
                index = tokenedDir[0]
                nameOfIndex = tokenedDir[1]
            }
            // desired index was found
            if (index === module_index) {
                return nameOfIndex;
            }


        }

        return " "
    }




}