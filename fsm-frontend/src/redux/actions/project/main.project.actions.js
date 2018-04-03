import { projectWebService }    from "../../../services/project.services";
import { alertActions }         from "../alert/alert.actions";
import { projectActions }       from "./project.action";
import Alert                    from 'react-s-alert';
import '../../../stylesheet/alert-style/jelly.css'

export const mainProjectActions = {
    postProject,
    uploadFile,
    openProjectsAction,
    userPublishedDetailsAction,
    userBidDetailsAction
}


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

function openProjectsAction () {

    return dispatch => {

        projectWebService.openProjectsWS()
            .then(
                response => {
                    console.log(response.data.projects);
                    console.log(response.data.message);
                    dispatch(projectActions.openProjectsR(response.data.projects));
                },
                error => {
                    console.log(error.data.message);
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

                console.log(userPublishedProjects.publishedDetails);
                console.log(userPublishedProjects.publishedDetailsStatus);

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

                console.log(userBidProjects.bidDetails);
                console.log(userBidProjects.bidDetailsStatus);

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