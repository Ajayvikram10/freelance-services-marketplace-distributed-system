// User Controller - Handles Registration, Login, Logout
const        express                = require('express');
const       passport                = require('passport');
require('../resources/middleware/passport');
const       router                  = express.Router();
const          _                    = require('lodash');
const        kafka                  = require('../resources/kafka/client');
const { authenticationMiddleware }  = require('../resources/middleware/session-authenticator');

// REGISTRATION - POST: '/register'
router.post('/register', function(req,res) {

    let registrationInfo = _.pick(req.body, ['username', 'email', 'password']);

    kafka.make_request('user_register_topic', registrationInfo, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// LOGIN - POST: '/login'
router.post('/login', function (req, res) {

    passport.authenticate('login', function (err, results) {

        if (err) {
            switch (err.name) {
                case 401:
                    return res.status(401).send(err.message);   // Invalid password
                case 404:
                    return res.status(401).send(err.message);   // User doesn't exist
                default:
                    return res.status(500).send(responseJSON("SERVER_someError"));
            }
        }
        req.login(results.user.username, function (err) {
            if(err) {
                console.log(err);
            }
            req.session.user = results.user.username;
        });
        res.status(200).send(results);
    })(req, res);
});

// method to serialize user for storage
passport.serializeUser(function(username, done) {
    done(null, username);
});

// method to de-serialize back for auth
passport.deserializeUser(function(username, done) {
    done(null, username);
});

// LOGOUT - POST: '/logout'
router.post('/logout', authenticationMiddleware(), function (req, res) {
    req.logout();
    req.session.destroy();
    return res.status(200).send(responseJSON("LOGOUT_success"));
});

// SESSION CHECK - POST: '/authenticateUser'
router.post('/authenticateUser', authenticationMiddleware(), function(req,res) {

    let username = req.session.user;

    kafka.make_request('user_authenticate_topic', { username: username }, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

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

module.exports = router;