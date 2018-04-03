import { alertConstants }   from "../../../helper/constants";

export const alertActions = {
    loginSuccess,
    loginError,
    logoutSuccess,
    clear,
    projectPostSuccess,
    projectPostError
};

function loginSuccess(successMsg) {
    return {
        type        : alertConstants.LOGIN_SUCCESS,
        successMsg  : successMsg
    };
}

function loginError(errMsg) {
    return {
        type    : alertConstants.LOGIN_ERROR,
        errMsg  : errMsg
    };
}

function logoutSuccess(successMsg) {
    return {
        type        : alertConstants.LOGOUT_SUCCESS,
        successMsg  : successMsg
    };
}

function clear() {
    return {
        type: alertConstants.CLEAR
    };
}

function projectPostSuccess(successMsg) {
    return {
        type        : alertConstants.PROJECT_SUCCESS,
        successMsg  : successMsg
    };
}

function projectPostError(errMsg) {
    return {
        type    : alertConstants.PROJECT_ERROR,
        errMsg  : errMsg
    };
}
