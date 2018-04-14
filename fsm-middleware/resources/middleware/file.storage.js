const      multer           = require('multer');
const        fs             = require('fs');
const       path            = require('path');
const   projectDirectory    = "public/project_files/";
const   profileDirectory    = "public/profile_images/";

var projectStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, createDirectory(projectDirectory, req.session.user));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

exports.uploadProjectFiles = multer({
    storage:projectStorage
});

function createDirectory(mainDirectory, username) {

    if (!fs.existsSync(mainDirectory)){
        fs.mkdirSync(mainDirectory);
    }
    let directory = mainDirectory + username;
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }

    return directory;
}

var profileStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, createDirectory(profileDirectory, req.session.user));
    },
    filename: function (req, file, cb) {
        filename = req.session.user + path.extname(file.originalname);
        cb(null, filename);
    }
});

exports.uploadProfileImage = multer({
    storage:profileStorage
});