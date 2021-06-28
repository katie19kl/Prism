import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";
import { prefix_server_url } from "../../HelperJS/url_helper";



// module & major & subject
async function getListOfAllFiles(major, module, subject) {


   

    let token = LocalStorage.getItem(LocalStorage.token);
    //let url  = "http://localhost:4000/file-handling/files_in_subject";
    let url  = prefix_server_url + "file-handling/files_in_subject";
    
    
   
    
    let postfix = "/" + major + "/" + module + "/" + subject;
    url = url + postfix;

    if (token === null || token === 'undefined') {

		return false;

	} else {
        const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			
		});

        return await req.get(url)

            .then((response) => {

                return response

            }, (error) => {
                return undefined
            });

    }
}



async function uploadSingleFiles(file, onUploadProgress, major, module, subject){

    //let url  = "http://localhost:4000/file-handling/files/" + major + "/" + module + "/" + subject;
    let url  = prefix_server_url + "file-handling/files/" + major + "/" + module + "/" + subject;
    
    
    let formData = new FormData();

    //for (const file of  FileList)
    formData.append("file",file);
  
    
    return await axios.post(url, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        onUploadProgress,
    })
}

/* 
    returns the extention of the file.
    when there's no extention, returns empty string.
*/
function defineIconOfFile(fileName) {

    let indexExtention = fileName.lastIndexOf('.');

    if (indexExtention !== -1) {
        let extention = fileName.substring(indexExtention + 1, fileName.length);

        return extention;

    } else {
        return '';
    }
}

export { getListOfAllFiles, uploadSingleFiles, defineIconOfFile }
