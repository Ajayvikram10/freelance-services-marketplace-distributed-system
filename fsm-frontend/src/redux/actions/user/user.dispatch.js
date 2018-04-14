import { userWebService }       from "../../../services/user.services";
import { profileWebService }    from "../../../services/profile.services";
import { alertActions }         from "../alert/alert.actions";
import { history }              from "../../../helper/history";
import { userActions }          from "./user.action";
import {projectActions} from "../project/project.action";

export const userDispatch = {
    register,
    login,
    logout,
    authenticateUser,
    updateInfo
};

function register (user) {

    return dispatch => {

        userWebService.registerWS(user)
            .then(
                response => {
                    dispatch(alertActions.loginSuccess(response.data.message));
                    history.push('/login');
                },
                error => {
                    dispatch(alertActions.loginError(error.data.message));
                }
            );
    };
}

function login (user) {

    return dispatch => {

        userWebService.loginWS(user)
            .then(
                response => {
                    dispatch(userActions.updateUser(response.data.user));
                    dispatch(alertActions.loginSuccess(response.data.message));
                    history.push('/home');
                },
                error => {
                    dispatch(alertActions.loginError(error.data.message));
                }
            );
    };
}

function logout () {

    return dispatch => {

        userWebService.logoutWS()
            .then(
                response => {
                    dispatch(userActions.logoutSuccess());
                    dispatch(projectActions.clearProjects());
                    dispatch(alertActions.logoutSuccess(response.data.message));
                    history.push('/login');
                },
                error => {
                    console.log(error.data.message);
                }
            );
    };
}

function authenticateUser () {

    return dispatch => {

        userWebService.authenticateUserWS()
            .then(
                response => {
                    dispatch(userActions.updateUser(response.data.user));
                },
                error => {
                    console.log(error.data.message);
                }
            );
    };
}

function updateInfo(updateInfo) {

    return dispatch => {

        profileWebService.updateProfile(updateInfo)
            .then(
                response => {
                    dispatch(userActions.updateUser(response.data.user));
                },
                error => {
                    console.log(error.data.message);
                }
            );
    };
}