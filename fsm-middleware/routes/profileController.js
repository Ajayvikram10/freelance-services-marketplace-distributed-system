const mysql             = require('../database/mysql/mysql');
const fs                = require('fs');
const imagesDirectory   = "public/profile_images/";
const DATABASE_POOL     = true;

// PROFILE IMAGE - GET: 'profile-image'
exports.fetchProfileImage = function fetchProfileImage(req, res) {

    let username = req.query.username;

    fs.readFile(imagesDirectory + username + '.jpg', function (err, content) {

        if (err) {
            res.status(400).send(responseJSON("IMG_not_found"));
        } else {
            // Content Type: Image.
            let base64Image = new Buffer(content, 'binary').toString('base64');
            res.status(200).send( { profileImage: base64Image });
        }
    });
}

// VISITOR PROFILE - GET: '/profile/visitor'
exports.fetchOtherUserDetails = function fetchOtherUserDetails(req, res) {

    let username = req.query.username;

    let otherUserQ = "SELECT * FROM users WHERE username='" + username + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(otherUserQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                if (rows.length > 0) {
                    // User found.
                    res.status(200).send({user: rows[0], message: "Visitor details fetch successful!"});
                }
                else // User doesn't exist. Hence, invalid visitor.
                    res.status(401).send(responseJSON("INVALID_visitor"));

                // Release the connection
                connection.release();
            });
        });
    } else  {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            if (rows.length > 0) {
                // User found.
                res.status(200).send({user: rows[0], message: "Visitor details fetch successful!"});
            }
            else // User doesn't exist. Hence, invalid visitor.
                res.status(401).send(responseJSON("INVALID_visitor"));
        }, otherUserQ);
    }

}

// PROFILE IMAGE UPLOAD - POST 'profile/save-profile-image'
exports.uploadProfImage = function uploadProfImage(req, res) {
    res.status(200).send(responseJSON("IMAGE_successMsg"));
}

// PROFILE PHONE - POST 'profile/update-phone'
exports.updatePhone = function updatePhone(req, res) {

    let updatePhoneQ = "UPDATE `users` SET `phone`='" + req.body.phone +"' WHERE `username`='" + req.session.user + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(updatePhoneQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Phone number updated successfully.
                res.status(200).send(responseJSON("PHONE_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Phone number updated successfully.
            res.status(200).send(responseJSON("PHONE_successMsg"));
        }, updatePhoneQ);
    }
    console.log("PROFILE Phone: User - ", req.session.user + '\n');
}

// PROFILE NAME - POST 'profile/update-name'
exports.updateName = function updateName(req, res) {

    let updateNameQ = "UPDATE `users` SET `name`='" + req.body.name +"' WHERE `username`='" + req.session.user + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(updateNameQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Name updated successfully.
                res.status(200).send(responseJSON("NAME_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Name updated successfully.
            res.status(200).send(responseJSON("NAME_successMsg"));
        }, updateNameQ);
    }
}

// PROFILE SUMMARY - POST 'profile/update-summary'
exports.updateSummary = function updateSummary(req, res) {

    let updateSummaryQ = "UPDATE `users` SET `summary`='" + req.body.summary +"' WHERE `username`='" + req.session.user + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(updateSummaryQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Summary updated successfully.
                res.status(200).send(responseJSON("SUMMARY_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Summary updated successfully.
            res.status(200).send(responseJSON("SUMMARY_successMsg"));
        }, updateSummaryQ);
    }
}

// PROFILE ABOUT ME - POST 'profile/update-aboutme'
exports.updateAboutMe = function updateAboutMe(req, res) {

    let updateAboutMeQ = "UPDATE `users` SET `about_me`='" + req.body.aboutme +"' WHERE `username`='" + req.session.user + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(updateAboutMeQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // About Me updated successfully.
                res.status(200).send(responseJSON("ABOUTME_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // About Me updated successfully.
            res.status(200).send(responseJSON("ABOUTME_successMsg"));
        }, updateAboutMeQ);
    }
    console.log("PROFILE About Me: User - ", req.session.user + '\n');
}

// PROFILE SKILLS - POST 'profile/update-skills'
exports.updateSkills = function updateAboutMe(req, res) {

    let updateSkillsQ = "UPDATE `users` SET `skills`='" + req.body.skills +"' WHERE `username`='" + req.session.user + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(updateSkillsQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Skills updated successfully.
                res.status(200).send(responseJSON("SKILLS_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Skills updated successfully.
            res.status(200).send(responseJSON("SKILLS_successMsg"));
        }, updateSkillsQ);
    }
    console.log("PROFILE Skills: User - ", req.session.user + '\n');
}

function responseJSON(responseType) {
    switch (responseType) {
        case "SKILLS_successMsg":
            return { message: 'Skills updated.' };
        case "ABOUTME_successMsg":
            return { message: 'About me updated.' };
        case "SUMMARY_successMsg":
            return { message: 'Summary updated.' };
        case "NAME_successMsg":
            return { message: 'Name updated.' };
        case "PHONE_successMsg":
            return { message: 'Phone number updated.' };
        case "IMG_not_found":
            return { message: 'Profile image not found.' };
        case "IMAGE_successMsg":
            return { message: 'Profile images uploaded.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "INVALID_visitor":
            return { message: "Visitor doesn't exist" };
        default:
            return { message: 'Some error with database connection.' };
    }
}