const mysql         = require('../database/mysql/mysql');
const DATABASE_POOL = true;

// POST PROJECT - POST '/post-project'
exports.postProject = function postProject(req, res) {

    let project = {
        "emp_username"  : req.body.sessionUsername,
        "title"         : req.body.title,
        "description"   : req.body.description,
        "budget_range"  : req.body.budget_range,
        "skills_req"    : req.body.skills_req,
        "status"        : req.body.status,
        "complete_by"   : req.body.complete_by,
        "filenames"     : req.body.filenames
    }

    let insertProject = "INSERT INTO projects SET ?";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(insertProject, project, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Project inserted successfully.
                res.status(200).send(responseJSON("PROJ_successMsg"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchObjData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Project inserted successfully.
            res.status(200).send(responseJSON("PROJ_successMsg"));
        }, project, insertProject);
    }
    console.log("POST PROJECT: Employer - ", project.emp_username + '\n');
}

// PROJECT FILE UPLOAD - POST '/post-project/upload'
exports.uploadFile = function postProject(req, res) {
    res.status(200).send(responseJSON("UPLOAD_successMsg"));
}

// HOME PAGE - OPEN PROJECTS - POST '/open-projects'
exports.openProjects = function openProjects(req, res) {

    let openProjectsQuery = "SELECT *,count(user_projects_project_id) as bid_count from(SELECT projects.project_id ,projects.emp_username,projects.title,projects.description,projects.budget_range,projects.skills_req, projects.status,DATE_FORMAT(projects.complete_by,'%d/%m/%Y') as niceDate,user_projects.project_id as user_projects_project_id from freelancerdb.projects left join freelancerdb.user_projects ON projects.project_id = user_projects.project_id Where status=\"OPEN\" ) as complete_table WHERE emp_username<>'"+req.session.user+"' group by project_id";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(openProjectsQuery, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Open Projects fetched successfully.
                res.status(200).send({ projects: rows, message: "Open Projects fetched" });

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Open Projects fetched successfully.
            res.status(200).send({ projects: rows, message: "Open Projects fetched" });
        }, openProjectsQuery);
    }
}

// BID DETAILS - POST '/bid-details'
exports.bidDetails = function bidDetails(req, res) {

    let projectId = req.body.projectId;
    console.log("bid det");
    console.log(projectId);
    let bidDetailsQ = "SELECT id,users.user_id,project_id,bid_price,days_req,username,name from  freelancerdb.user_projects left join  freelancerdb.users  on users.user_id = user_projects.user_id  where project_id='" + projectId + "'";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(bidDetailsQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Bid Details fetched successfully.
                res.status(200).send({bidDetails: rows, message: "Bid Details fetched."});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Bid Details fetched successfully.
            res.status(200).send({bidDetails: rows, message: "Bid Details fetched."});
        }, bidDetailsQ);
    }
}

// PROJECT DETAILS - GET '/project-details'
exports.projectDetails = function projectDetails(req, res) {

    let projecDetailsQ = "SELECT name,project_id,emp_username,title,description,budget_range,skills_req,filenames,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate from  projects inner join users on  projects.emp_username =  users.username where project_id='"+req.query.projectId+"';";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(projecDetailsQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Project Details fetched successfully.
                res.status(200).send({projectDetails: rows, message: "Project Details fetched."});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Project Details fetched successfully.
            res.status(200).send({projectDetails: rows, message: "Project Details fetched."});
        }, projecDetailsQ);
    }

}

// BID HEADER DETAILS - GET '/bid-header-details'
exports.bidHeaderDetails = function bidHeaderDetails(req, res) {

    let bidHeaderQ = "SELECT count(*) as bid_count, avg(bid_price) as average_bid FROM freelancerdb.user_projects where project_id='"+req.query.projectId+"';";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(bidHeaderQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Bid header details fetched successfully.
                res.status(200).send({bidHeaderDetails: rows, message: "Bid header details fetched."});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Bid header details fetched successfully.
            res.status(200).send({bidHeaderDetails: rows, message: "Bid header details fetched."});
        }, bidHeaderQ);
    }
}

// HIRE FREELANCER - POST '/hire-freelancer'
exports.hireFreelancer = function hireFreelancer(req, res) {

    console.log('here');
    console.log(req);

    let hireFreelancerQ ="UPDATE `freelancerdb`.`projects` SET `status`='Assigned',`freelancer_username`='"+req.body.freelancer_username+"' WHERE `project_id`='"+req.body.project_id+"';";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(hireFreelancerQ, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Hire Freelancer updated successfully.
                res.status(200).send({freelancerDetails: rows, message: "Hire Freelancer updated successfully."});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Hire Freelancer updated successfully.
            res.status(200).send({freelancerDetails: rows, message: "Hire Freelancer updated successfully."});
        }, hireFreelancerQ);
    }
}

// POST BID - POST '/post-bid'
exports.postBid = function postBid(req, res) {

    let deleteBidQuery="DELETE FROM `freelancerdb`.`user_projects` WHERE `user_id`='"+req.body.user_id+"' AND `project_id`='"+req.body.project_id+"';"
    let insertBidQuery = "INSERT INTO `freelancerdb`.`user_projects` (`user_id`, `project_id`, `bid_price`, `days_req`) VALUES ('"+req.body.user_id+"', '"+req.body.project_id+"', '"+req.body.bid_price+"', '"+req.body.days_req+"');";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(deleteBidQuery, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                } else {
                    mysql.pool.getConnection(function (err, connection) {
                        if (err) {
                            console.log(err);
                            return res.status(400).send(responseJSON("SERVER_someError"));
                        }
                        // if you got a connection...
                        connection.query(insertBidQuery, function (err, rows) {
                            if (err) {
                                connection.release();
                                return res.status(400).send(responseJSON("SERVER_someError"));
                            }
                            // Hire Freelancer updated successfully.
                            res.status(200).send({bidUpdated: rows, message: "Bid updated successfully."});

                            // Release the connection
                            connection.release();
                        });
                    });
                }
                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            } else {
                mysql.fetchData(function (err, rows) {
                    if (err) {
                        return res.status(400).send(responseJSON("SERVER_someError"));
                    }
                    // Bid updated successfully.
                    res.status(200).send({bidUpdated: rows, message: "Bid updated successfully."});
                }, insertBidQuery);
            }
        }, deleteBidQuery);
    }
}

// DASHBOARD - PUBLISHED PROJECTS - GET '/published-projects'
exports.publishedProjects = function publishedProjects(req, res) {

    let publishQuery = "SELECT projects.project_id,title,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate,status,freelancer_username,table2.avg_bid FROM freelancerdb.projects left join (SELECT project_id,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as table2 on  projects.project_id=table2.project_id  where emp_username='"+req.query.username+"' order by status desc;";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(publishQuery, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Published Projects fetched successfully.
                res.status(200).send({publishedDetails: rows, message: "Published projects fetched"});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Published Projects fetched successfully.
            res.status(200).send({publishedDetails: rows, message: "Published projects fetched"});
        }, publishQuery);
    }
    console.log("PUBLISHED PROJECTS: For - ", req.session.user + '\n');
}

// DASHBOARD - BID PROJECTS - POST '/bid-projects'
exports.bidProjects = function bidProjects(req, res) {
    let bidQuery = "SELECT * from projects inner join (SELECT * FROM freelancerdb.user_projects inner join (SELECT project_id as table_bid_pid,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as user_projects_avg  on user_projects.project_id=user_projects_avg.table_bid_pid where user_id='"+req.query.user+"') as table_bid on projects.project_id=table_bid.table_bid_pid order by status desc;";

    console.log("hello",bidQuery);

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // if you got a connection...
            connection.query(bidQuery, function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                // Bid Projects fetched successfully.
                res.status(200).send({bidDetails: rows, message: "Bid projects fetched"});

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            // Bid Projects fetched successfully.
            res.status(200).send({bidDetails: rows, message: "Bid projects fetched"});
        }, bidQuery);
    }
    console.log("BID PROJECTS: For - ", req.session.user + '\n');
}

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