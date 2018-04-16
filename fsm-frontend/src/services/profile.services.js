import axios from 'axios';

// const backendURL = 'http://localhost:3000';
const backendURL = 'http://18.188.91.5:3000';

axios.defaults.withCredentials = true;

export const profileWebService = {
    uploadProfileImageWS,
    fetchProfileImageWS,
    fetchOtherUserDetailsWS,
    updateProfile
};


function uploadProfileImageWS (profileImage) {
    let uploadProfileImgUrl   = backendURL + '/profile/save-profile-image';
    return axiosPost(uploadProfileImgUrl, profileImage);
}

function fetchProfileImageWS(username) {
    let profileImageUrl   = backendURL + '/profile/profile-image?username=' + username;
    return axiosGet(profileImageUrl);
}

function updateProfile (updateInfo) {
    let updateInfoUrl   = backendURL + '/profile/update-profile';
    return axiosPost(updateInfoUrl, updateInfo);
}

function fetchOtherUserDetailsWS (username) {
    let otherUserUrl   = backendURL + '/profile/visitor?username=' + username;
    return axiosGet(otherUserUrl);
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