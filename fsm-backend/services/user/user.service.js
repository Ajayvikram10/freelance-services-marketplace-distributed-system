// This file handles - Registration, Login, Authenticate - requests.
const  _    = require('lodash');
const User  = require('../../database/mongo/models/user');

// Registration
function handle_register_request(registrationInfo, callback){

    let user = new User (registrationInfo);
    let result = {};

    user.save()
        .then((user) => {
            // User registered successfully.
            console.log('Saved User Registration Info: ', user._id);
            result.code = 200;
            result.value = responseJSON("REG_successMsg");
            callback(null, result);
        }, (err) => {
            // Connection Failed or Model not valid.
            if(err.code === 11000) {
                if(err.errmsg.match(/username_1/g) == "username_1"){
                    // Duplicate Username
                    result.code = 400;
                    result.value = responseJSON("REG_errorUsername");
                    callback(null, result);
                }
                else if(err.errmsg.match(/email_1/g) == "email_1") {
                    // Duplicate Email
                    result.code = 400;
                    result.value = responseJSON("REG_errorEmail");
                    callback(null, result);
                }
            }
            console.log('Unable to save User Registration Info: ', err);
            result.code = 500;
            result.value = responseJSON("SERVER_someError");
            callback(null, result);
        });
}

// Login
function handle_login_request(logInfo, callback){

    let loginInfo = _.pick(logInfo, ['username', 'password']);
    let result = {};

    User.findByCredentials(loginInfo)
        .then((user) => {
            // Passwords match && User was found.
            let userInfo = _.pick(user, ['username', 'email', 'name', 'summary', 'phone', 'about_me', 'skills', 'looking_for']);
            result.code = 200;
            result.value = { user: userInfo, message: "Login Successful" };
            callback(null, result);
        })
        .catch((error) => {
            if (error.errMsg === "INVALID_login") {
                // Passwords don't match
                result.code = 401;
                result.value = responseJSON(error.errMsg);
                callback(null, result);
            } else if (error.errMsg === "INVALID_user") {
                // User doesn't exist.
                result.code = 404;
                result.value = responseJSON(error.errMsg);
                callback(null, result);
            }
        });
}

// Authenticate
function handle_authenticate_request(userInfo, callback){

    let result = {};

    User.where({ username: userInfo.username })
        .findOne(function (err, user) {
        if (err) console.log(err);
        if (user) {
            if(!user) {
                // User was found.
                result.code = 404;
                result.value = responseJSON("INVALID_user");
                callback(null, result);
            } else {
                // User found.
                let userInfo = _.pick(user, ['username', 'email', 'name', 'summary', 'phone', 'about_me', 'skills', 'looking_for']);
                result.code = 200;
                result.value = { user: userInfo };
                callback(null, result);
            }
        }
    });
}

// Response messages.
function responseJSON(responseType) {
    switch (responseType) {
        case "INVALID_session":
            return { message: 'Invalid Session. Please login again!' };
        case "REG_successMsg":
            return { message: 'User registered successfully.' };
        case "REG_errorUsername":
            return { message: "This username already exists, please choose another" };
        case "REG_errorEmail":
            return { message: "This email address is already in use." };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "INVALID_login":
            return { message: "The username and password you entered did not match our records. Please double-check and try again." };
        case "INVALID_user":
            return { message: "The username doesn't have an account. Please create an account. " };
        case "LOGOUT_success":
            return { message: 'Logout successful.' };
        case "IMG_not_found":
            return { message: 'Profile image not found.' };
        case "IMAGE_successMsg":
            return { message: 'Profile images uploaded.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}

module.exports = {
    handle_register_request,
    handle_login_request,
    handle_authenticate_request
};