import axios from "axios";
import LocalStorage from "../../../HelperJS/LocalStorage";

// module & major & subject
async function getAllReviewsForSoldier(major, module, subject, studentId) {

    console.log(major)
    console.log(module)
    console.log(subject)


    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/review/all-reviews/";
    

    
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

        let filteredArr = []
        return await req.get(url)

            .then((response) => {
                return response

            }, (error) => {
                return undefined
            });

    }
}

export {getAllReviewsForSoldier}