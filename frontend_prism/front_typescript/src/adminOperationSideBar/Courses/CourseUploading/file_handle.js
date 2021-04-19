import axios from "axios";
import LocalStorage from "./../../../HelperJS/LocalStorage";




async function getListOfAllFiles() {

    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/file-handling/all_files"

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
                return response

            }, (error) => {
                return undefined
            });

    }
}


async function uploadMultFiles(FileList){

   
    ////// IF SINGLE file --- TAKE CARE !!!!!!!!!!!!!!
    let url  = "http://localhost:4000/file-handling/mult_file"

    let formData = new FormData();

    for (const file of  FileList)
        formData.append("files",file);
    console.log(formData)
    axios.post(url, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
}

async function uploadSingleFiles(file, onUploadProgress){

   
    ////// IF SINGLE file --- TAKE CARE !!!!!!!!!!!!!!
    let url  = "http://localhost:4000/file-handling/single_file"

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

export { getListOfAllFiles, uploadMultFiles,uploadSingleFiles }