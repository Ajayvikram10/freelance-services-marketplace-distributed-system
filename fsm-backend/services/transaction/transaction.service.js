const  _            = require('lodash');
const Transaction   = require('../../database/mongo/models/transaction');

// Fetch User transactions
function handle_user_transaction(userInfo, callback){

    let result  = {};

    Transaction.find({$or: [
            {from: userInfo.username},
            {to: userInfo.username}
        ]}, function (err, data) {
        if (data) {
            result.code     = 200;
            result.value    = { transactionDetails : data };
        } else {
            result.code     = 400;
            result.value    = "No user transaction details";
            console.log(result.value);
        }

        callback(null, result);
    });
}

// Make User transactions
function handle_make_transaction(transactionInfo, callback){

    let result  = {};

    let date    = new Date().getDate();
    let month   = new Date().getMonth() + 1;
    let year    = new Date().getFullYear();

    let myObj = new Transaction({
        from    : transactionInfo.from,
        to      : transactionInfo.to,
        type    : transactionInfo.type,
        amount  : transactionInfo.amount,
        Date    : date + '-' + month + '-' + year,
        project : transactionInfo.project
    });

    let promise = myObj.save();

    promise.then(function (data) {
        console.log("data-")
        console.log(data);
        result.value = { makeTransaction : data, message: 'Transaction successful'};
        result.code = 200;
        callback(null, result);
    })
        .catch(function (err) {
            console.log('error:', err.message);
            result.value = { message: 'Transaction failed. Please try again after sometime!'};
            result.code = 400;
            callback(null, result);
        });
}

module.exports = {
    handle_user_transaction,
    handle_make_transaction
};