import axios from "axios";
import LocalStorage from "../../HelperJS/LocalStorage";
import { getUserInfoByJWT } from '../../HelperJS/extract_info';
import { prefix_server_url } from "../../HelperJS/url_helper";

// module & major & subject
async function getListSubmissionOfSubject(major, module, subject, studentId) {



    let token = LocalStorage.getItem(LocalStorage.token);
    //let url  = "http://localhost:4000/user-submission/";
    let url  = prefix_server_url+ "user-submission/";
    
    
    
    let postfix = studentId + "/" + major + "/" + module + "/" + subject;
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

async function removeFileFromSubmission(major_, module_, subject_, file_name){


    let token = LocalStorage.getItem(LocalStorage.token);
//    let url  = "http://localhost:4000/user-submission/" + file_name;
    let url  = prefix_server_url + "user-submission/" + file_name;

    

    



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
 
        return await req.delete(url, { data: userSubmissionDTO })
        .then((response) => {
            return response

        }, (error) => {
            return undefined
        });
    }
}

async function uploadSingleSubmission(file, onUploadProgress, major, module, subject) {

    let token = LocalStorage.getItem(LocalStorage.token);
    //let url  = "http://localhost:4000/user-submission"
    let url  = prefix_server_url + "user-submission"
    

    let formData = new FormData();

    formData.append("file",file);

    formData.append("major",major);
    formData.append("module",module);
    formData.append("subject",subject);
    


    
    return await axios.post(url, formData, {
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
        },
        onUploadProgress,
    })
}

async function sendCreateReviewRequest(personalId,
    major, module, subject, reviewContent, grade, gradeDesc, rolesArr) {

    let token = LocalStorage.getItem(LocalStorage.token);
    
    if (token === null || token === 'undefined') {

		return false;

	} else {

        //let url  = "http://localhost:4000/review";
        let url  = prefix_server_url + "review";
        


        return await getUserInfoByJWT().then(async (user) => {
            
            if (user === undefined) {
                return undefined;
            } else if (user.data === undefined || user.data === "") {
                return undefined;
            } else {
                user = user.data;

                let reviewDto = {
                    soldierId: personalId,
                    major: major,
                    module: module,
                    subject: subject,
                    gradeDescription: gradeDesc,
                    checkerRole: user.role,
                    checkerId: user.personalId,
                    comment: reviewContent,
                    showTo: rolesArr,
                    grade: grade
                };
        
                const req = await axios.create({
                    baseURL: url,
                    timeout: 1000,
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },            
                });
        
                return await req.post(url, reviewDto).then((response) => {
                    return response;
        
                }, (error) => {
                    return undefined;
                });
            }
        });
    }
}


export { 
    getListSubmissionOfSubject,
    removeFileFromSubmission,
    uploadSingleSubmission, 
    sendCreateReviewRequest
}