exports.isValid = function isValid(fieldName, value, prevState) {

    let illegalChars = /\W/; // allow letters, numbers, and underscores

    switch(fieldName) {
        case 'email':
            if(value.trim() === "") {
                prevState.isEmailValid = false;
                prevState.fieldValidationErrors.email = "Please enter an email address";
                break;
            } else if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                prevState.isEmailValid = false;
                prevState.fieldValidationErrors.email = "Please enter a valid email address.";
                break;
            } else {
                prevState.isEmailValid = true;
                prevState.fieldValidationErrors.email = "";
                break;
            }
        case 'username':
            if(value.trim() === "") {
                prevState.isUserNameValid = false;
                prevState.fieldValidationErrors.username = "Please enter a username";
                break;
            } else if(value.length < 3 || value.length >= 16) {
                prevState.isUserNameValid = false;
                prevState.fieldValidationErrors.username = "Username must be 3-16 characters";
                break;
            } else if (illegalChars.test(value.trim())) {
                prevState.isUserNameValid = false;
                prevState.fieldValidationErrors.username = "Username must be alphanumeric starting with a letter";
                break;
            } else if((!isNaN(parseInt(value[0], 10)))) {
                prevState.isUserNameValid = false;
                prevState.fieldValidationErrors.username = "Username must be alphanumeric starting with a letter";
                break;
            } else {
                prevState.isUserNameValid = true;
                prevState.fieldValidationErrors.username = "";
                break;
            }
        case 'password':
            if(value.trim() === "") {
                prevState.isPassWordValid = false;
                prevState.fieldValidationErrors.password = "Please enter a password";
                break;
            } else if(value.length < 6) {
                prevState.isPassWordValid = false;
                prevState.fieldValidationErrors.password = "Password must be 6 characters minimum";
                break;
            } else {
                prevState.isPassWordValid = true;
                prevState.fieldValidationErrors.password = "";
                break;
            }
        case 'name':
            if(value.trim() === "") {
                prevState.isNameValid = false;
                prevState.fieldValidationErrors.name = "Please enter a project name.";
                break;
            } else if(value.length < 3 || value.length >= 16) {
                prevState.isNameValid = false;
                prevState.fieldValidationErrors.name = "Project name must be 3-16 characters";
                break;
            } else if (illegalChars.test(value.trim())) {
                prevState.isNameValid = false;
                prevState.fieldValidationErrors.name = "Project name must be alphanumeric starting with a letter";
                break;
            } else if((!isNaN(parseInt(value[0], 10)))) {
                prevState.isNameValid = false;
                prevState.fieldValidationErrors.name = "Project name must be alphanumeric starting with a letter";
                break;
            } else {
                prevState.isNameValid = true;
                prevState.fieldValidationErrors.name = "";
                break;
            }
        default:
            break;
    }

    return prevState;
}