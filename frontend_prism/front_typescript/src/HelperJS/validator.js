/*
 * The function returns a list of fields which
 * must be defined but are the opposite. 
 */
function validateFields(data) {

    return checkRequired(data);

}

function checkRequired(data) {

    let undefinedFields = [];

    let requiredFields = {
        "personalId": data.personalId,
        "username": data.username,
        "password": data.password,
        "role": data.role,
        "firstName": data.firstName,
        "lastName": data.lastName,
        "gender": data.gender
    };

    for (var key in requiredFields) {

        if ((requiredFields[key] === undefined) || (requiredFields[key] === "")
        || (requiredFields[key] === "None")) {
            undefinedFields.push(key);
        }
    }

    return undefinedFields

}

function handleOptionalFields(data, role) {

    let major = data.major;
    let listOfMajors = data.listMajors;
    let phoneNumber = data.phoneNumber;
    let commander = data.commander;
    let fields = {};

    // Each soldier has only one major.
    if (role === 'soldier') {

        if (!major.includes('None') && !major.includes(undefined)) {
            fields.major = major;
        }

    // Commanders may have more than one major.
    } else if (role === 'commander') {
        
        let len = Object.keys(listOfMajors).length;
        if (len > 0) {

            let majors = [];

            for (var currMajor in listOfMajors) {
                
                if (listOfMajors[currMajor]) {
                    majors.push(currMajor);
                }
            }

            fields.major = majors;
        }
    }

    if (phoneNumber !== undefined) {
        fields.phoneNumber = phoneNumber;
    }

    if (commander !== undefined) {
        fields.commander = commander;
    }

    return fields;
}


export { validateFields, handleOptionalFields };