import { userConstants }    from "../../../helper/constants";

export const userActions = {
    updateUser,
    logoutSuccess
};

function updateUser(user) {
    return {
        type    : userConstants.USER_AUTH_SUCCESS,
        user    : user
    };
}


function logoutSuccess() {
    return {
        type    : userConstants.USER_LOGOUT_SUCCESS,
    };
}
