import { alertConstants }   from "../../helper/constants";

var initialState = {
    isAlert     : false,
    message     : '',
    type        : ''
}

export function alert(state = initialState, action) {

    switch (action.type) {
        case alertConstants.LOGIN_SUCCESS:
            state = {
                ...state,
                isAlert : true,
                message : action.successMsg,
                type    : 'alert-success'
            };
            break;
        case alertConstants.LOGIN_ERROR:
            state = {
                ...state,
                isAlert : true,
                message : action.errMsg,
                type    : 'alert-danger'
            };
           break;
        case alertConstants.CLEAR:
            state = {
                ...state,
                isAlert     : false,
                message     : '',
                type        : ''
            };
            break;
        case alertConstants.LOGOUT_SUCCESS:
            state = {
                ...state,
                isAlert : true,
                message : action.successMsg,
                type    : 'alert-success'
            };
            break;
        case alertConstants.PROJECT_SUCCESS:
            state = {
                ...state,
                isAlert : true,
                message : action.successMsg,
                type    : 'alert-success'
            };
            break;
        case alertConstants.PROJECT_ERROR:
            state = {
                ...state,
                isAlert : true,
                message : action.errMsg,
                type    : 'alert-danger'
            };
            break;
        default:
            return state
    }
    return state;
}