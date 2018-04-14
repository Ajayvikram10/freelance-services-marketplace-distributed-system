import { projectConstants }    from "../../helper/constants";

const initialState = {
    projects : []
};

export function projectDetails(state = initialState, action) {

    switch (action.type) {
        case projectConstants.OPEN_PROJECTS:
            return {
                ...state,
                projects: action.projects
            };
        case projectConstants.CLEAR_PROJECTS:
            return {
                projects: []
            };
        default:
            return state
    }
}
