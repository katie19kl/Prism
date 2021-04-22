import { Major } from "src/server/users/common/major.enum";
import { FileHandlingService } from "../file-handling.service";



export class FileManager{



    createPathMajorModuleSubject(major: Major, module: string, subject: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module + '/' + subject;
        return pathMajor;
    }



    async getAllFilesOfPath(major, module_, subject){
        let path =  this.createPathMajorModuleSubject(major,module_,subject);
        let pathToDowload = "/" + major + "/" + module_ + "/" + subject
        let all_file_url_ = FileHandlingService.dowloadSomeFileUrl_;
		let files_name = [];
		const directory = path;
		const fs = require('fs');

        console.log("path")
        console.log(path);

        const get_f = async() => {

			await new Promise ((resolve, reject) => {

				fs.readdir(directory, async (err, files) => {
                    
                    
					if (err) {
						reject(err);
					}
                    for await(const file of files){
                        const stat = await fs.promises.stat( directory + "/" + file);
                        if (await stat.isFile()) {
                            console.log("=============");
                            console.log(file);
                            console.log("is file only");
                            files_name.push(
                                {
                                file_name: file,
                                url: all_file_url_ + file + pathToDowload,
                                }
                            )		
                        }
                        else {
                            files_name.push(
                                {
                                file_name: file,
                                //url: " ",
                                }
                            )	

                        }
                    }
					resolve(files)
				});
			})
		}

		await get_f()
        console.log("---->>>>>>>>")
		console.log(files_name)
        console.log("---->>>>>>>>")
		return files_name
    }








    async uploadFile(file, major:Major, module_choosen: string, 
        subject_choosen: string)
    {

            console.log("000")
            let file_name = file.originalname;
            //let finalPath = this.createFinalPath(major, module_index, insideModuleIndex)
            
            
            let pathToStore = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_choosen + "/" + subject_choosen
            pathToStore = pathToStore + "/" + file_name;
            
            console.log("1111")
            console.log(pathToStore)
            this.storingFileToPath(file, pathToStore)



    } 

        
    storingFileToPath(file, pathToStore){
        console.log(pathToStore)
        let fs = require('fs');
        fs.open(pathToStore, 'wx', (err, desc) => {
            if(!err && desc) {
                
                fs.writeFile(desc, file.buffer, (err) => {
                        if (err) {
                            throw err;
                        }                
                        console.log('Results Received');
                })
            }
        })
    }



    async getFileByName(file_name:String, res, major, module, subject){



        let dirPath = this.createPathMajorModuleSubject(major, module, subject)
        const directory = dirPath + "/";

		let path = require('path');
		let mime = require('mime');
		
		let fs = require('fs');
		let file = directory+file_name

		let filename = path.basename(file);
		let mimetype = mime.lookup(file);

		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);

		var filestream = fs.createReadStream(file);
		filestream.pipe(res);

    }








}