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

function handleOptionalFields(data) {

    let major = data.major;
    let phoneNumber = data.phoneNumber;
    let commander = data.commander;
    let fields = {};


    if (major !== 'None' && major !== undefined) {
        fields.major = major;
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