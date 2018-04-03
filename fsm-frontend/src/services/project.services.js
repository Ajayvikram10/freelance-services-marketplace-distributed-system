import axios                from 'axios';

const backendURL = 'http://localhost:3000';

axios.defaults.withCredentials = true;

export const projectWebService = {
    postProject,
    uploadFile,
    openProjectsWS,
    userPublishedDetailsWS,
    userBidDetailsWS,
    fetchProjectBidDetailsWS,
    fetchProjectDetailsWS,
    fetchBidHeaderDetailsWS,
    hireFreelancerWS,
    postBidWS
}

function postProject (project) {
    let postProjectUrl   = backendURL + '/project/post-project';
    return axiosPost(postProjectUrl, project);
}

function hireFreelancerWS (data) {
    let hireFreelancerProjectUrl   = backendURL + '/project/hire-freelancer';
    return axiosPost(hireFreelancerProjectUrl, data);
}

function postBidWS (bid) {
    let postBidUrl   = backendURL + '/project/post-bid';
    return axiosPost(postBidUrl, bid);
}

function fetchProjectBidDetailsWS(projectId) {
    let bidDetailsUrl   = backendURL + '/project/bid-details';
    return axiosPost(bidDetailsUrl, projectId);
}

function fetchProjectDetailsWS(projectId) {
    let projectDetailsUrl   = backendURL + '/project/project-details?projectId=' + projectId;
    return axiosGet(projectDetailsUrl);
}

function fetchBidHeaderDetailsWS(projectId) {
    let bidHeaderDetailsUrl   = backendURL + '/project/bid-header-details?projectId=' + projectId;
    return axiosGet(bidHeaderDetailsUrl);
}

function uploadFile (file) {
    let uploadFileUrl   = backendURL + '/project/post-project/upload';
    return axiosPost(uploadFileUrl, file);
}

function openProjectsWS (project) {
    let openProjectsUrl   = backendURL + '/project/open-projects';
    return axiosPost(openProjectsUrl, project);
}

function userPublishedDetailsWS (username) {
    let publishedProjectUrl   = backendURL + '/project/published-projects?username=' + username;
    return axiosGet(publishedProjectUrl);
}

function userBidDetailsWS (userId) {
    let bidProjectUrl   = backendURL + '/project/bid-projects?user=' + userId;
    return axiosGet(bidProjectUrl);
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