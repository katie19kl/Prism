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

    return undefinedFields;

}

function handleOptionalFields(data, role) {

    let major = data.major;
    let listOfMajors = data.listMajors;
    let phoneNumber = data.phoneNumber;
    let commander = data.commander;
    let fields = {};

    // Each soldier has only one major.
    if (role === 'soldier') {

        if (!major.includes('None') && !major.includes(undefined) && !major.includes("")) {
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

    if (phoneNumber !== undefined && phoneNumber !== "") {
        fields.phoneNumber = phoneNumber;
    }

    if (commander !== undefined && commander !== "") {
        fields.commander = commander;
    }

    return fields;
}

/* Returns true if the string is a positive whole number. */
function isNumeric(value) {
    return /^\d+$/.test(value);
}

/* Returns true when the string contains letters and digits only */
function onlyLettersAndDigits(str) {
    if (str.match("^[a-zA-Z0-9]+$")) {
    	return true;
    }
    return false;
}

function checkPassword(input) { 

    // pwd should have the following constraints:
    // 1. length from 6 to 20.
    // 2. must contains one uppercase letter
    // 3. must contains one lowercase letter
    // 4. must contains at least one digit.
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (input.match(passw)) { 
        return true;
    }
    else { 
        return false;
    }
}

/* Used to validate first name/last name. */
function isValidName(name) {
    var reg = /^[a-z]+$/i;

	if (name !== '' && reg.test(name)) {
  		return true;
	} else {
  		return false;
	}
}

export { 
    validateFields,
    handleOptionalFields, 
    isNumeric,
    onlyLettersAndDigits, 
    checkPassword,
    isValidName
};