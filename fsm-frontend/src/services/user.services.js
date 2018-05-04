import axios from 'axios';

const backendURL = 'http://localhost:3000';

axios.defaults.withCredentials = true;

export const userWebService = {
    registerWS,
    loginWS,
    logoutWS,
    authenticateUserWS
};

function registerWS (user) {
    let registerUrl = backendURL + '/users/register';
    return axiosPost(registerUrl, user);
}

function loginWS (user) {
    let loginUrl    = backendURL + '/users/login';
    return axiosPost(loginUrl, user);
}

function logoutWS () {
    let logoutUrl   = backendURL + '/users/logout';
    return axiosPost(logoutUrl, null);
}

function authenticateUserWS () {
    let authenticateUserUrl   = backendURL + '/users/authenticateUser';
    return axiosPost(authenticateUserUrl, null);
}

function axiosPost(url, data) {
   return axios.post(url, data)
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
