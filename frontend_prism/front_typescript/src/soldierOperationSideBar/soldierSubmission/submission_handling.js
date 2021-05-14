//('user-submission'):soldierId/:major/:module/:subject
import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";

// module & major & subject
async function getListSubmissionOfSubject(major, module, subject, studentId) {

    console.log(major)
    
    console.log(module)
    
    console.log(subject)


    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/user-submission/";
    

    
    let postfix = studentId + "/" + major + "/" + module + "/" + subject;
    url = url + postfix;

    console.log(url + "    is provided URL ")

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


async function removeFileFromSubmission(major_, module_, subject_, file_name){
    console.log(major_)
    
    console.log(module_)
    
    console.log(subject_)


    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/user-submission/" + file_name;
    






    console.log(url + "    is provided URL ")

    if (token === null || token === 'undefined') {

		return false;

	} else {

        
        let userSubmissionDTO = {
            major: major_,
            module: module_,
            subject: subject_,
        }

        userSubmissionDTO = {
            major: major_,
            module: module_,
            subject: subject_,
        }




        const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},




			
		});

 
        return await req.delete(url, { data:  userSubmissionDTO     })

            .then((response) => {
                console.log(response)
                return response

            }, (error) => {
                return undefined
            });

    }

}

async function uploadSingleSubmission(file, onUploadProgress, major, module, subject){

    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/user-submission"

    
    console.log("---------------------------------------")
    console.log(file)
    console.log("---------------------------------------")
    
    
    console.log("=======================================")
    let formData = new FormData();

    formData.append("file",file);

    formData.append("major",major);
    formData.append("module",module);
    formData.append("subject",subject);
    


    console.log(formData)
    console.log("=======================================")
    
    return await axios.post(url, formData, {
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
        },
        onUploadProgress,
    })
}





export { getListSubmissionOfSubject, removeFileFromSubmission,uploadSingleSubmission}