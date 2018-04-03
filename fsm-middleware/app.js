let express         = require('express');
let logger          = require('morgan');
let cookieParser    = require('cookie-parser');
let bodyParser      = require('body-parser');   // Handles JSON in our api
let path            = require('path');
let cors            = require('cors');
let passport        = require('passport');
require('./resources/middleware/passport')(passport);

// MongoDB Sessions Setup
let mongoSessionURL = "mongodb://localhost:27017/sessions";
let expressSessions = require("express-session");
let mongoStore      = require("connect-mongo/es5")(expressSessions);

// Middleware
// let { authenticate }    = require('./resources/middleware/session-authenticator');
// const { uploadProjectFiles, uploadProfileImage } = require('./resources/middleware/file.storage');

// Application Routes.
let index               = require('./routes/index');
let userController      = require('./routes/userController');
// var projectController   = require('./routes/projectController');
// var profileController   = require('./routes/profileController');

// Express App
const app = express();

// View Engine Setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //set up ejs for template

app.use(logger('dev')); //log every request to the console
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));  // CORS Setup

// Environment Setup
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));    // to support URL-encoded bodies
app.use(cookieParser());    //read cookies (needed for auth)
app.use(express.static(path.join(__dirname, 'public')));

// Express Sessions Setup
app.use(expressSessions({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 30 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000,    // Session extension time limit:  5 minutes :  300 seconds
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session()); //persistent login session


// Default Route
app.use('/'         , index);
app.use('/users'    , userController);
// app.use('/profile'  , profileController);
// app.use('/project'  , projectController);

// React Frontend Requests - < http://localhost:3001 >
// User Controller
// POST
// app.post('/register', userController.registerUser);
// app.post('/login', userController.loginUser);
// app.post('/logout', authenticate, userController.logoutUser);
// app.post('/authenticateUser', authenticate, userController.authenticateUser);


// Profile Controller
// POST
// app.post('/profile/save-profile-image', uploadProfileImage.any(), authenticate, profileController.uploadProfImage);
// app.post('/profile/update-phone', authenticate, profileController.updatePhone);
// app.post('/profile/update-name', authenticate, profileController.updateName);
// app.post('/profile/update-summary', authenticate, profileController.updateSummary);
// app.post('/profile/update-aboutme', authenticate, profileController.updateAboutMe);
// app.post('/profile/update-skills', authenticate, profileController.updateSkills);
// GET
// app.get('/profile-image', authenticate, profileController.fetchProfileImage);
// app.get('/profile/visitor', authenticate, profileController.fetchOtherUserDetails);
//
// Project Controller
// POST
// app.post('/project/post-project', authenticate, projectController.postProject);
// app.post('/project/post-project/upload', authenticate, uploadProjectFiles.any(), projectController.uploadFile);
// app.post('/project/open-projects', authenticate, projectController.openProjects);
// app.post('/project/bid-details', authenticate, projectController.bidDetails);
// app.post('/project/hire-freelancer', authenticate, projectController.hireFreelancer);
// app.post('/project/post-bid', authenticate, projectController.postBid);
// GET
// app.get('/project/published-projects', authenticate, projectController.publishedProjects);
// app.get('/project/bid-projects', authenticate, projectController.bidProjects);
// app.get('/project/project-details', authenticate, projectController.projectDetails);
// app.get('/project/bid-header-details', authenticate, projectController.bidHeaderDetails);


// Catch 404 and Forward to Error Handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;