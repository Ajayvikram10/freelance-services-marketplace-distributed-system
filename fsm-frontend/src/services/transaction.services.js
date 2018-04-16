import axios from 'axios';

// const backendURL = 'http://localhost:3000';
const backendURL = 'http://18.188.91.5:3000';

axios.defaults.withCredentials = true;

export const transactionWebService = {
    fetchTransactionDetailsWS,
    makeTransactionWS
};

function fetchTransactionDetailsWS () {
    let transactionDetUrl   = backendURL + '/transaction/transaction-details';
    return axiosGet(transactionDetUrl);
}

function makeTransactionWS (transaction) {
    let makeTransactionUrl   = backendURL + '/transaction/make-transaction';
    return axiosPost(makeTransactionUrl, transaction);
}

function axiosPost(url, data) {
    return axios.post(url, data)
        .then(handleSuccess)
        .catch(handleError);
}

function axiosGet(url) {
    return axios.get(url)
        .then(handleSuccess)
        .catch(handleError);
}

function handleSuccess(response) {
    return response;
}

function handleError(error) {
    if(error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return Promise.reject(error.response);
    }
}