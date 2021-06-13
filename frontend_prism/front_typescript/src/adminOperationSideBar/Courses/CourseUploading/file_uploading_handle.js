import axios from "axios";
import LocalStorage from "../../../HelperJS/LocalStorage";



// module & major & subject
async function getListOfAllFiles(major, module, subject) {


    console.log("ASK A LIST OF FILE ASK A LIST OF FILE ASK A LIST OF FILE ASK A LIST OF FILE ")
    console.log(subject)


    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/file-handling/files_in_subject";
    
    console.log(major)
    
    console.log(module)
    
    console.log(subject)
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
                console.log(response)
                console.log("-!!!!!-!!!!!-!!!!!-")
                return response

            }, (error) => {
                return undefined
            });

    }
}



async function uploadSingleFiles(file, onUploadProgress, major, module, subject){

  
    let url  = "http://localhost:4000/file-handling/files/" + major + "/" + module + "/" + subject;

    
    console.log("---------------------------------------")
    console.log(file)
    console.log("---------------------------------------")
    let formData = new FormData();

    //for (const file of  FileList)
    formData.append("file",file);
    console.log(formData)
    
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
