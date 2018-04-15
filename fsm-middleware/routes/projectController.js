// User Controller - Handles Registration, Login, Logout
const        express                = require('express');
const        router                 = express.Router();
const          _                    = require('lodash');
const        kafka                  = require('../resources/kafka/client');
const { authenticationMiddleware }  = require('../resources/middleware/session-authenticator');
const   { uploadProjectFiles }      = require('../resources/middleware/file.storage');

// Post Project - POST '/post-project'
router.post('/post-project', authenticationMiddleware(), function(req,res) {

    let postProjectInfo = _.pick(req.body, ['title', 'description', 'budget_range', 'skills_req', 'status', 'complete_by', 'filenames']);
    _.assign(postProjectInfo, { "emp_username"  : req.session.user });

    kafka.make_request('project_post_topic', postProjectInfo, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// Project Files- POST '/post-project'
router.post('/post-project/upload', authenticationMiddleware(), uploadProjectFiles.any(), function(req,res) {
    console.log("uploaded file");
    res.status(200).send(responseJSON("UPLOAD_successMsg"));

});

// Home Page - Open projects - POST '/open-projects'
router.post('/open-projects', authenticationMiddleware(), function(req,res) {

    let openProjects = _.pick(req.body, ['username']);

    kafka.make_request('project_open_topic', openProjects, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// Home Page - Relevant projects - POST '/relevant-projects'
router.post('/relevant-projects', authenticationMiddleware(), function(req,res) {

    let relevantProjects = _.pick(req.body, ['skills']);

    kafka.make_request('project_relevant_topic', relevantProjects, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// Bid Project Page - Fetch Bid details - POST '/project/bid-details'
router.post('/bid-details', authenticationMiddleware(), function(req,res) {

    let fetchBidDetails = _.pick(req.body, ['projectId']);

    kafka.make_request('project_get_bid_details_topic', fetchBidDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// Bid Project Page - Fetch Project details - POST '/project/project-details'
router.get('/project-details', authenticationMiddleware(), function(req,res) {

    let publishProjectDetails = _.pick(req.query, ['projectId']);

    kafka.make_request('project_project_details', publishProjectDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

// Bid Project Page - Post a bid - POST '/project/post-bid'
router.post('/post-bid', authenticationMiddleware(), function(req,res) {

    let postBidDetails = _.pick(req.body, ['name', 'project_id', 'bid_price', 'days_req']);
    _.assign(postBidDetails, { "username"  : req.session.user });

    kafka.make_request('project_post_bid', postBidDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// Bid Project Page - Submit project - POST '/project/submit-project'
router.post('/submit-project', authenticationMiddleware(), function(req,res) {

    let submitDetails = _.pick(req.body, ['id', 'filenames']);
    _.assign(submitDetails, { "username"  : req.session.user });

    kafka.make_request('project_submit_project', submitDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});



// // HIRE FREELANCER - POST '/hire-freelancer'
// exports.hireFreelancer = function hireFreelancer(req, res) {
//
//     console.log('here');
//     console.log(req);
//
//     let hireFreelancerQ ="UPDATE `freelancerdb`.`projects` SET `status`='Assigned',`freelancer_username`='"+req.body.freelancer_username+"' WHERE `project_id`='"+req.body.project_id+"';";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(hireFreelancerQ, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Hire Freelancer updated successfully.
//                 res.status(200).send({freelancerDetails: rows, message: "Hire Freelancer updated successfully."});
//
//                 // Release the connection
//                 connection.release();
//             });
//         });
//     } else {
//         mysql.fetchData(function (err, rows) {
//             if (err) {
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // Hire Freelancer updated successfully.
//             res.status(200).send({freelancerDetails: rows, message: "Hire Freelancer updated successfully."});
//         }, hireFreelancerQ);
//     }
// }

router.get('/published-projects', authenticationMiddleware(), function(req,res) {

    let publishProjectDetails = _.pick(req.query, ['username']);

    kafka.make_request('project_published_details', publishProjectDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

router.get('/bid-projects', authenticationMiddleware(), function(req,res) {

    let bidProjectDetails = _.pick(req.query, ['user']);

    kafka.make_request('project_bid_details', bidProjectDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

function responseJSON(responseType) {
    switch (responseType) {
        case "PROJ_successMsg":
            return { message: 'Project posted successfully.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "UPLOAD_successMsg":
            return { message: 'Files uploaded.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}

module.exports = router;