const        express                = require('express');
const        router                 = express.Router();
const          _                    = require('lodash');
const        kafka                  = require('../resources/kafka/client');
const { authenticationMiddleware }  = require('../resources/middleware/session-authenticator');

// Transactions Page - Fetch transactions details - GET '/transaction/transaction-details'
router.get('/transaction-details', authenticationMiddleware(), function(req,res) {

    let userTransactionDetails = { "username"  : req.session.user };

    kafka.make_request('transaction_user_details', userTransactionDetails, function(err,results){
        if(err){
            return res.status(500).send(responseJSON("SERVER_someError"));
        }
        return res.status(results.code).send(results.value);
    });
});

// PostTransactions Page - Make transactions details - POST '/transaction/make-transaction'
router.post('/make-transaction', authenticationMiddleware(), function(req,res) {

    let transactionInfo = _.pick(req.body, ['from', 'to', 'type', 'amount', 'project']);
    _.assign(transactionInfo, { "username"  : req.session.user });

    kafka.make_request('transaction_submit_details', transactionInfo, function(err,results){
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