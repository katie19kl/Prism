import axios from "axios";
import { getUserInfoByJWT } from "../../../HelperJS/extract_info";
import LocalStorage from "../../../HelperJS/LocalStorage";


// module & major & subject
async function getAllReviewsByRole(major, module, subject, studentId, role) {

    let token = LocalStorage.getItem(LocalStorage.token);
    let url  = "http://localhost:4000/review/reviews-role/";
    let postfix = studentId + "/" + major + "/" + module + "/" + subject + "/" + role;
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
            return response;

        }, (error) => {
            return undefined;
        });

    }
}

async function deleteReview(soldierId, major, module, subject, date, time, checkerId, checkerRole) {

    let token = LocalStorage.getItem(LocalStorage.token);
    
    if (token === null || token === 'undefined') {

		return false;

	} else {

        let url = 'http://localhost:4000/review/'

        let payload = {
            soldierId: soldierId,
            major: major,
            module: module,
            subject: subject,
            submittedDate: date,
            submittedTime: time,
            checkerId: checkerId,
            checkerRole: checkerRole
        };

        const req = await axios.create({
			baseURL: url,
			timeout: 1000,
			headers: { 
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
		});

        return await req.delete(url, { data: payload })
        .then((response) => {
            return response;

        }, (error) => {
            return undefined;
        });
    }
}

async function getReviews(soldierId, major, module, subject) {

    // find out the role of the current user by his token.
    return await getUserInfoByJWT().then(async (response) => {

        if (response === undefined) {
            return undefined;
       
        } else if (response.data === undefined || response.data === '') {
            return undefined;

        } else {
            response = response.data;
            let currRole = response.role;

            console.log("current role: ", currRole);

            return await getAllReviewsByRole(major, module, subject, soldierId, currRole)
            .then((result) => {

                if (result === undefined) {
                    return undefined;
                } else {
                    let arrData = result.data;
                    let allowedReviews = arrData;

                    return allowedReviews;
                }
            });
        }
    });
}


export { getAllReviewsByRole, deleteReview, getReviews }