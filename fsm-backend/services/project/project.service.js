const Project   = require('../../database/mongo/models/project');
const User      = require('../../database/mongo/models/user');
const mongoose  = require('../../database/mongo/mongoose');

// Post Project
function handle_post_project(projectInfo, callback) {

    let project = new Project(projectInfo);
    let result = {};

    project.save()
        .then((project) => {
            // Project posted successfully.
            console.log('Saved Project details: ', project._id);
            result.code = 200;
            result.value = responseJSON("PROJ_successMsg");
            callback(null, result);
        }, (err) => {
            // Error saving post project.
            if (err) {
                console.log(err);
            }
            result.code = 500;
            result.value = responseJSON("SERVER_someError");
            callback(null, result);
        });
}

// Open Project
function handle_open_project(openProjects, callback) {

    let result = {};

    Project.find({
        status: "OPEN",
        emp_username: {$ne: openProjects.username}
    }).exec()
        .then(function (projects) {
            // Open Projects fetched successfully.
            if (projects.length === 0) {
                result.code = 404;
                result.value = {message: "No Open Projects fetched"};
                callback(null, result);
            } else {
                result.code = 200;
                result.value = {projects: projects, message: "Open Projects fetched"};
                callback(null, result);
            }
        }).catch(function (err) {
        // Projects fetching issue
        if (err) {
            console.log(err);
        }
        result.code = 500;
        result.value = responseJSON("SERVER_someError");
        callback(null, result);
    });
}

// Relevant Project
function handle_relevant_project(relevantProjects, callback) {

    let result = {};

    let pipeline = [
        {
            "$match": {
                "skills_req.2": {
                    "$exists": true
                }
            }
        },
        {
            "$redact": {
                "$cond": [
                    {
                        "$gte": [
                            {
                                "$size": {
                                    "$setIntersection": [
                                        "$skills_req",
                                        relevantProjects.skills
                                    ]
                                }
                            },
                            3
                        ]
                    },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            }
        }
    ];

    // fetch relevant projects
    let promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("relevant_projects.js data-");
        console.log(data);
        if (data.length > 0) {
            result.code  = 200;
            result.value = { relevantProjects: data, message: "Relevant Projects fetched"};
        } else {
            result.code = 404;
            result.value = { message: "No Relevant Projects fetched" };
        }
        callback(null, result);
    }).catch(function (err) {
        console.log('error:', err.message);
        result.code     = 500;
        result.value    = responseJSON("SERVER_someError");
        callback(err, result);
    });

}

// Published Project Fetch
function handle_published_project(publishedProjects, callback) {

    let result = {};

    let pipeline = [
        {
            "$match": {
                "emp_username": {
                    $eq: publishedProjects.username
                }
            }
        },
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$group": {
                "_id": {
                    "id": "$_id",
                    "title": "$title",
                    "complete_by": "$complete_by",
                    "status": "$status",
                    "freelancer_username": "$freelancer_username",
                    "emp_username": "$emp_username"
                },
                "avg_bid": {
                    "$avg": "$bids.bid_price"
                }
            }
        }
    ];

    let promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("dashboard_project.js data-");
        console.log(data);
        if (data.length > 0) {
            let published = [];
            data.map((project) => {
                let proj = project._id;
                proj['avg_bid'] = project.avg_bid;
                console.log(proj);
                published.push(proj);
            });
            result.code  = 200;
            result.value = { publishedDetails: published, message: "Published Projects fetched"};
            callback(null, result);
        }else {
            result.code  = 404;
            result.value = { message: "No Published Projects fetched" };
            callback(null, result);
        }
    }).catch(function (err) {
        console.log('error:', err.message);
        result.code     = 500;
        result.value    = responseJSON("SERVER_someError");
        callback(err, result);
    });

}

// Bid Projects Fetch
function handle_bid_project(bidProjectFetch, callback) {

    let result = {};

    console.log("-->");
    console.log(bidProjectFetch.user);

    let pipeline = [
        {
            "$match": {
                "bids.username": {
                    $eq: bidProjectFetch.user
                }
            }
        },
        {
            "$addFields": {
                "avg_bid": {
                    "$avg": "$bids.bid_price"
                }
            }
        },
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$match": {
                "bids.username": {
                    $eq: bidProjectFetch.user
                }
            }
        }
    ];

    // fetch bid projects
    let promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("dashboard_bids.js data-");
        console.log(data);
        if (data.length > 0) {
            let bidProjects = [];
            data.map((project) => {
                bidProjects.push(project._id);
            });
            result.code  = 200;
            result.value = { bidDetails: data, message: "Bid Projects fetched"};
            callback(null, result);
        }else {
            result.code  = 404;
            result.value = { message: "No Bid Projects fetched" };
        }
        callback(null, result);
    }).catch(function (err) {
        // just need one of these
        console.log('error:', err.message);
        result.code     = 500;
        result.value    = responseJSON("SERVER_someError");
        callback(err, result);
    });
}

// Fetch Bids Details
function handle_get_bids_project(getBids, callback) {

    let result = {};

    let pipeline = [
        {
            "$match": {
                "_id": new mongoose.mongo.ObjectId(getBids.projectId)
            }
        },
        {
            "$project": {
                "bids": 1.0
            }
        },
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        }
    ];

    let promise = Project.aggregate(pipeline);

    promise.then(function (data) {
        console.log("project_BidDetails.js data-");
        console.log(data);
        result.value = { bidDetails: data, message: "Bid Details fetched." };
        if (data) {
            result.code = 200;
            callback(null, result);
        }
    }).catch(function (err) {
        // just need one of these
        console.log('error:', err.message);
        result.value    = responseJSON("SERVER_someError");
        result.code     = '400';
        callback(err, result);
    });
}

// Fetch Project Details
function handle_project_details(projDetails, callback) {

    let result = {};

    let pipeline = [
        {
            "$match": {
                "_id": new mongoose.mongo.ObjectId(projDetails.projectId)
            }
        },
        {
            "$addFields": {
                "bid_count": {
                    "$size": { "$ifNull": [ "$bids", [] ] }
                }
            }
        },
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$group": {
                "_id": {
                    "id"                    : "$_id",
                    "title"                 : "$title",
                    "complete_by"           : "$complete_by",
                    "status"                : "$status",
                    "freelancer_username"   : "$freelancer_username",
                    "emp_username"          : "$emp_username",
                    "budget_range"          : "$budget_range",
                    "skills_req"            : "$skills_req",
                    "description"           : "$description",
                    "filenames"             : "$filenames",
                    "bid_count"				: "$bid_count",
                    "freelancer_files"      : "$freelancer_files"
                },
                "avg_bid": {
                    "$avg": "$bids.bid_price"
                }
            }
        }
    ];

    let promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("project_details.js data-");
        console.log(data);
        result.value = {projectDetails: data, message: "Project Details fetched."};
        if (data) {
            result.code = 200;
            callback(null, result);
        }
    }).catch(function (err) {
        // just need one of these
        console.log('error:', err.message);
        result.value    = responseJSON("SERVER_someError");
        result.code     = '400';
        callback(err, result);
    });
}

// Post Bids
function handle_posting_bid(bidInfo, callback) {

    let result = {};

    let writeResult = Project.update(
        { _id: bidInfo.project_id, "bids.username": bidInfo.username },
        {
            $set: {
                "bids.$.bid_price"   : bidInfo.bid_price,
                "bids.$.days_req"    : bidInfo.days_req,
                "bids.$.name"        : bidInfo.name,
                "bids.$.username"    : bidInfo.username
            }
        },
        { "upsert": true },
        function (err, doc) {
            if (err) {

                result.code     = "400";
                result.value    = "Bid update failed";
                console.log("###Error");
                console.log(err);
                // callback(err, res);
            }

            result.code = "200";
            result.value = {bidUpdated: doc, message: "Bid updated successfully."};
            console.log("###doc");
            console.log(doc);
            callback(null, result);
        }
    );

    if(!writeResult.nModified) {
        Project.update(
            {
                _id: bidInfo.project_id,
                "bids.username": {
                    $ne: bidInfo.username
                }
            },
            {
                "$push" : {
                    "bids": {
                        "bid_price"   : bidInfo.bid_price,
                        "days_req"    : bidInfo.days_req,
                        "name"        : bidInfo.name,
                        "username"    : bidInfo.username
                    }
                }
            },
            { "upsert": true },
            function (err, doc) {
                if (err) {

                    result.code = "400";
                    result.value = "Bid update failed";
                    console.log("###Error");
                    console.log(err);
                    callback(err, result);
                }

                result.code = "200";
                result.value = {bidUpdated: doc, message: "Bid updated successfully."};
                console.log("###doc");
                console.log(doc);
                callback(null, result);
            }
        )
    }
}

// Submit Project
function handle_submit_project(submitInfo, callback) {

    let result = {};

    Project.findOneAndUpdate(
        {_id: submitInfo.id},
        {
            $set: {
                "freelancer_files": submitInfo.filenames+",",
                "status": 'SUBMITTED'
            }
        },

        function (err, doc) {
            if (err) {

                result.code  = 400;
                result.value = "Freelancer cannot be set.";
                console.log(result.value);
                callback(err, result);
            }

            result.code  = 200;
            result.value = doc;

            console.log(doc);
            callback(null, result);
        }
    );
}

// Hire Freelancer
function handle_hire_freelancer(hireInfo, callback) {

    let result = {};


    Project.findOneAndUpdate(
        { _id: hireInfo.project_id },
        {
            $set: {
                "freelancer_username"   : hireInfo.freelancer_username,
                "status"                : 'ASSIGNED'
            }
        },
        { new: true },
        function (err, doc) {
            if (err) {

                result.code     = 400;
                result.value    = "Hiring freelancer failed";
                console.log(result.value);
                callback(err, result);
            }

            User.findOne({username: doc.freelancer_username}, function (err, user) {
                result.code     = 200;
                result.value    = user;
                console.log(user);
                callback(null, result);
            })
        }
    );
}

// Project Response messages.
function responseJSON(responseType) {
    switch (responseType) {
        case "PROJ_successMsg":
            return {message: 'Project posted successfully.'};
        case "SERVER_someError":
            return {message: 'There is some issue in server. Please try again later.'};
        case "UPLOAD_successMsg":
            return {message: 'Files uploaded.'};
        default:
            return {message: 'Some error with database connection.'};
    }
}

module.exports = {
    handle_post_project,
    handle_open_project,
    handle_relevant_project,
    handle_published_project,
    handle_bid_project,
    handle_get_bids_project,
    handle_project_details,
    handle_posting_bid,
    handle_submit_project,
    handle_hire_freelancer
};