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


// // BID DETAILS - POST '/bid-details'
// exports.bidDetails = function bidDetails(req, res) {
//
//     let projectId = req.body.projectId;
//     console.log("bid det");
//     console.log(projectId);
//     let bidDetailsQ = "SELECT id,users.user_id,project_id,bid_price,days_req,username,name from  freelancerdb.user_projects left join  freelancerdb.users  on users.user_id = user_projects.user_id  where project_id='" + projectId + "'";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(bidDetailsQ, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Bid Details fetched successfully.
//                 res.status(200).send({bidDetails: rows, message: "Bid Details fetched."});
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
//             // Bid Details fetched successfully.
//             res.status(200).send({bidDetails: rows, message: "Bid Details fetched."});
//         }, bidDetailsQ);
//     }
// }


// PROJECT DETAILS - GET '/project-details'
// exports.projectDetails = function projectDetails(req, res) {
//
//     let projecDetailsQ = "SELECT name,project_id,emp_username,title,description,budget_range,skills_req,filenames,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate from  projects inner join users on  projects.emp_username =  users.username where project_id='"+req.query.projectId+"';";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(projecDetailsQ, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Project Details fetched successfully.
//                 res.status(200).send({projectDetails: rows, message: "Project Details fetched."});
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
//             // Project Details fetched successfully.
//             res.status(200).send({projectDetails: rows, message: "Project Details fetched."});
//         }, projecDetailsQ);
//     }
//
// }

// // BID HEADER DETAILS - GET '/bid-header-details'
// exports.bidHeaderDetails = function bidHeaderDetails(req, res) {
//
//     let bidHeaderQ = "SELECT count(*) as bid_count, avg(bid_price) as average_bid FROM freelancerdb.user_projects where project_id='"+req.query.projectId+"';";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(bidHeaderQ, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Bid header details fetched successfully.
//                 res.status(200).send({bidHeaderDetails: rows, message: "Bid header details fetched."});
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
//             // Bid header details fetched successfully.
//             res.status(200).send({bidHeaderDetails: rows, message: "Bid header details fetched."});
//         }, bidHeaderQ);
//     }
// }
//
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
//
// // POST BID - POST '/post-bid'
// exports.postBid = function postBid(req, res) {
//
//     let deleteBidQuery="DELETE FROM `freelancerdb`.`user_projects` WHERE `user_id`='"+req.body.user_id+"' AND `project_id`='"+req.body.project_id+"';"
//     let insertBidQuery = "INSERT INTO `freelancerdb`.`user_projects` (`user_id`, `project_id`, `bid_price`, `days_req`) VALUES ('"+req.body.user_id+"', '"+req.body.project_id+"', '"+req.body.bid_price+"', '"+req.body.days_req+"');";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(deleteBidQuery, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 } else {
//                     mysql.pool.getConnection(function (err, connection) {
//                         if (err) {
//                             console.log(err);
//                             return res.status(400).send(responseJSON("SERVER_someError"));
//                         }
//                         // if you got a connection...
//                         connection.query(insertBidQuery, function (err, rows) {
//                             if (err) {
//                                 connection.release();
//                                 return res.status(400).send(responseJSON("SERVER_someError"));
//                             }
//                             // Hire Freelancer updated successfully.
//                             res.status(200).send({bidUpdated: rows, message: "Bid updated successfully."});
//
//                             // Release the connection
//                             connection.release();
//                         });
//                     });
//                 }
//                 // Release the connection
//                 connection.release();
//             });
//         });
//     } else {
//         mysql.fetchData(function (err, rows) {
//             if (err) {
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             } else {
//                 mysql.fetchData(function (err, rows) {
//                     if (err) {
//                         return res.status(400).send(responseJSON("SERVER_someError"));
//                     }
//                     // Bid updated successfully.
//                     res.status(200).send({bidUpdated: rows, message: "Bid updated successfully."});
//                 }, insertBidQuery);
//             }
//         }, deleteBidQuery);
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
// app.get('/project/published-projects', authenticate, projectController.publishedProjects);
// // DASHBOARD - PUBLISHED PROJECTS - GET '/published-projects'
// exports.publishedProjects = function publishedProjects(req, res) {
//
//     let publishQuery = "SELECT projects.project_id,title,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate,status,freelancer_username,table2.avg_bid FROM freelancerdb.projects left join (SELECT project_id,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as table2 on  projects.project_id=table2.project_id  where emp_username='"+req.query.username+"' order by status desc;";
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(publishQuery, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Published Projects fetched successfully.
//                 res.status(200).send({publishedDetails: rows, message: "Published projects fetched"});
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
//             // Published Projects fetched successfully.
//             res.status(200).send({publishedDetails: rows, message: "Published projects fetched"});
//         }, publishQuery);
//     }
//     console.log("PUBLISHED PROJECTS: For - ", req.session.user + '\n');
// }

router.get('/bid-projects', authenticationMiddleware(), function(req,res) {

    let bidProjectDetails = _.pick(req.query, ['user']);

    kafka.make_request('project_bid_details', bidProjectDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });

});

// app.get('/project/bid-projects', authenticate, projectController.bidProjects);
// // DASHBOARD - BID PROJECTS - POST '/bid-projects'
// exports.bidProjects = function bidProjects(req, res) {
//     let bidQuery = "SELECT * from projects inner join (SELECT * FROM freelancerdb.user_projects inner join (SELECT project_id as table_bid_pid,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as user_projects_avg  on user_projects.project_id=user_projects_avg.table_bid_pid where user_id='"+req.query.user+"') as table_bid on projects.project_id=table_bid.table_bid_pid order by status desc;";
//
//     console.log("hello",bidQuery);
//
//     if(DATABASE_POOL) {
//         mysql.pool.getConnection(function (err, connection) {
//
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send(responseJSON("SERVER_someError"));
//             }
//             // if you got a connection...
//             connection.query(bidQuery, function (err, rows) {
//                 if (err) {
//                     connection.release();
//                     return res.status(400).send(responseJSON("SERVER_someError"));
//                 }
//                 // Bid Projects fetched successfully.
//                 res.status(200).send({bidDetails: rows, message: "Bid projects fetched"});
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
//             // Bid Projects fetched successfully.
//             res.status(200).send({bidDetails: rows, message: "Bid projects fetched"});
//         }, bidQuery);
//     }
//     console.log("BID PROJECTS: For - ", req.session.user + '\n');
// }

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