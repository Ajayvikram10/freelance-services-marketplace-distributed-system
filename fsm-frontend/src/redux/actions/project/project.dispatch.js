import { projectWebService }    from "../../../services/project.services";
import { alertActions }         from "../alert/alert.actions";
import Alert                    from 'react-s-alert';
import '../../../stylesheet/alert-style/jelly.css'

export const projectDispatch = {
    postProject,
    uploadFile,
    userPublishedDetailsAction,
    userBidDetailsAction
};


function postProject (project) {

    return dispatch => {

        projectWebService.postProject(project)
            .then(
                response => {
                    console.log(response.data.message);
                    dispatch(alertActions.projectPostSuccess(response.data.message));
                    Alert.info(response.data.message, {
                        effect: 'jelly',
                        timeout: 1500,
                        offset: 50
                    });
                },
                error => {
                    dispatch(alertActions.projectPostError(error.data.message));
                }
            );
    };
}

function userPublishedDetailsAction(username) {

    return projectWebService.userPublishedDetailsWS(username)
        .then(
            response => {
                let userPublishedProjects = {
                    publishedDetailsStatus  : false,
                    publishedDetails        : []
                };
                if(response.data.publishedDetails.length > 0){
                    userPublishedProjects.publishedDetailsStatus = true;
                }
                userPublishedProjects.publishedDetails = response.data.publishedDetails;

                return userPublishedProjects;
            },
            error => {
                console.log(error.data.message);
            }
        );
}

function userBidDetailsAction(userId) {

    return projectWebService.userBidDetailsWS(userId)
        .then(
            response => {
                let userBidProjects = {
                    bidDetailsStatus  : false,
                    bidDetails        : []
                };
                if(response.data.bidDetails.length > 0){
                    userBidProjects.bidDetailsStatus = true;
                }
                userBidProjects.bidDetails = response.data.bidDetails;

                return userBidProjects;
            },
            error => {
                console.log(error.data.message);
            }
        );
}

function uploadFile (file) {

    return dispatch => {
        projectWebService.uploadFile(file)
            .then(
                response => {
                    console.log(response.data.message);
                    Alert.info(response.data.message, {
                        effect: 'jelly',
                        timeout: 1500,
                        offset: 50
                    });
                },
                error => {
                    console.log(error);
                }
            )
    }
}