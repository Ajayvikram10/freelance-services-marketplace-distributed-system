const multer            = require('multer');
const fs                = require('fs');
var path                = require('path');
var   mainDirectory     = "public/project_files/";
var   profileDirectory  = "public/profile_images/";

var projectStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, createDirectory(req.session.user));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

exports.uploadProjectFiles = multer({
    storage:projectStorage
});

function createDirectory(username) {

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
        cb(null, profileDirectory);
    },
    filename: function (req, file, cb) {
        filename = req.session.user + path.extname(file.originalname);
        cb(null, filename);
    }
});

exports.uploadProfileImage = multer({
    storage:profileStorage
});