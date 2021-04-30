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

    major = "firmware"
    module = "2- Module_second"
    subject = "2.1- topic_a"
   
    ////// IF SINGLE file --- TAKE CARE !!!!!!!!!!!!!!
    let url  = "http://localhost:4000/file-handling/upload_single_file"

    console.log("the major, module..: ")
    console.log(major, module, subject)

    
    url = url + "/" + major + "/" + module + "/" + subject;

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

export { getListOfAllFiles, uploadSingleFiles }