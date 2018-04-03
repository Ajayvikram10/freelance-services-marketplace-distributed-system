import { userConstants }    from "../../helper/constants";

const initialState = {
    isAuthenticated : false,
    user : {}
};

export function userDetails(state = initialState, action) {

    switch (action.type) {
        case userConstants.USER_AUTH_SUCCESS:
            return {
                isAuthenticated: !!action.user,
                user: action.user
            };
        case userConstants.USER_LOGOUT_SUCCESS:
            return {
                isAuthenticated: false,
                user: {}
            };
        default:
            return state
    }
}
