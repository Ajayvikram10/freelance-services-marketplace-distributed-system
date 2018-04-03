import axios from 'axios';

const backendURL = 'http://localhost:3000';

axios.defaults.withCredentials = true;

export const userWebService = {
    registerWS,
    loginWS,
    logoutWS,
    authenticateUserWS,
    fetchProfileImageWS,
    uploadProfileImageWS,
    updatePhoneDetailsWS,
    updateNameDetailsWS,
    updateSummaryWS,
    updateAboutMeWS,
    updateSkillsWS,
    fetchOtherUserDetailsWS
}

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

function fetchProfileImageWS(username) {
    let profileImageUrl   = backendURL + '/profile-image?username=' + username;
    return axiosGet(profileImageUrl);
}

function fetchOtherUserDetailsWS (username) {
    let otherUserUrl   = backendURL + '/profile/visitor?username=' + username;
    return axiosGet(otherUserUrl);
}

function updatePhoneDetailsWS (phone) {
    let updatePhoneUrl   = backendURL + '/profile/update-phone';
    return axiosPost(updatePhoneUrl, phone);
}

function updateNameDetailsWS (name) {
    let updateNameUrl   = backendURL + '/profile/update-name';
    return axiosPost(updateNameUrl, name);
}

function updateSummaryWS (summary) {
    let updateSummaryUrl   = backendURL + '/profile/update-summary';
    return axiosPost(updateSummaryUrl, summary);
}

function updateAboutMeWS (aboutme) {
    let updateAboutMeUrl   = backendURL + '/profile/update-aboutme';
    return axiosPost(updateAboutMeUrl, aboutme);
}

function updateSkillsWS (skills) {
    let updateSkillsUrl   = backendURL + '/profile/update-skills';
    return axiosPost(updateSkillsUrl, skills);
}

function uploadProfileImageWS (profileImage) {
    let uploadProfileImgUrl   = backendURL + '/profile/save-profile-image';
    return axiosPost(uploadProfileImgUrl, profileImage);
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