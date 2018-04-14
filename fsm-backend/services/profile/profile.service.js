// This file handles - Registration, Login, Authenticate - requests.
const  _    = require('lodash');
const User  = require('../../database/mongo/models/user');

// Update Profile Info - Name, Summary, About me, Skills, Phone
function handle_profile_info(updateInfo, callback){

    let result  = {};
    let update  = {};
    update[updateInfo.field] = updateInfo.value;

    User.findOneAndUpdate({username: updateInfo.username}, { $set : update }, {new: true}, function (err, doc) {
        if (err) {
            result.code     = 500;
            result.value    = responseJSON("SERVER_someError");
            console.log(result.value);
            callback(err, result);
        }
        result.code     = 200;
        result.value    = { user: doc, message: responseJSON(`${updateInfo.field}_successMsg`) };
        callback(null, result);
    });
}

// Fetch Visitor Profile Info
function handle_visitor_profile(visitorProfileInfo, callback){

    let result = {};

    User.where({ username: visitorProfileInfo.username })
        .findOne(function (err, user) {
            if (err) console.log(err);
            if (user) {
                if(!user) {
                    // Visitor was not found.
                    result.code = 404;
                    result.value = responseJSON("INVALID_visitor");
                    callback(null, result);
                } else {
                    // Visitor found.
                    let userInfo = _.pick(user, ['username', 'email', 'name', 'summary', 'phone', 'about_me', 'skills', 'looking_for']);
                    result.code = 200;
                    result.value = { user: userInfo, message: "Visitor details fetch successful!" };
                    callback(null, result);
                }
            }
        });
}

function responseJSON(responseType) {
    switch (responseType) {
        case "skills_successMsg":
            return 'Skills updated.';
        case "about_me_successMsg":
            return 'About me updated.';
        case "summary_successMsg":
            return 'Summary updated.';
        case "name_successMsg":
            return 'Name updated.';
        case "phone_successMsg":
            return 'Phone number updated.';
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "INVALID_visitor":
            return { message: "Visitor doesn't exist" };
        default:
            return { message: 'Some error with database connection.' };
    }
}

module.exports = {
    handle_profile_info,
    handle_visitor_profile
};