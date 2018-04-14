const        express                = require('express');
const       router                  = express.Router();
const          _                    = require('lodash');
const        kafka                  = require('../resources/kafka/client');
const { authenticationMiddleware }  = require('../resources/middleware/session-authenticator');
const           fs                  = require('fs');
const       imagesDirectory         = "public/profile_images/";
const   { uploadProfileImage }      = require('../resources/middleware/file.storage');

// PROFILE IMAGE - GET: '/profile-image'
router.get('/profile-image', authenticationMiddleware(), function(req,res) {

    let username = req.query.username;
    let userImageDir = imagesDirectory + "/" + username + "/";
    fs.readFile(userImageDir + username + '.jpg', function (err, content) {

        if (err) {
            res.status(401).send(responseJSON("IMG_not_found"));
        } else {
            // Content Type: Image.
            let base64Image = new Buffer(content, 'binary').toString('base64');
            res.status(200).send({profileImage: base64Image});
        }
    });
});

// PROFILE IMAGE UPLOAD - POST 'profile/save-profile-image'
router.post('/save-profile-image', authenticationMiddleware(), uploadProfileImage.any(), function(req,res) {
    res.status(200).send(responseJSON("IMAGE_successMsg"));
});

// PROFILE INFO UPDATE - POST 'profile/update-profile' - Name, Summary, About me, Skills, Phone
router.post('/update-profile', authenticationMiddleware(), function(req,res) {

    let updateInfo = _.pick(req.body, ['field', 'value']);
    _.assign(updateInfo, { "username"  : req.session.user });

    kafka.make_request('profile_update_info', updateInfo, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

// VISITOR PROFILE - POST 'profile/visitor'
router.get('/visitor', authenticationMiddleware(), function(req,res) {

    let visitorProfileInfo = _.pick(req.query, ['username']);

    kafka.make_request('profile_fetch_visitor', visitorProfileInfo, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

function responseJSON(responseType) {
    switch (responseType) {
        case "IMG_not_found":
            return { message: 'Profile image not found.' };
        case "IMAGE_successMsg":
            return { message: 'Profile images uploaded.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        default:
            return { message: 'Some error with server.' };
    }
}

module.exports = router;