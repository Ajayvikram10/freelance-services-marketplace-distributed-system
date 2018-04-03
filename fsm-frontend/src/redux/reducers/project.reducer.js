import { projectConstants }    from "../../helper/constants";

const initialState = {
    projects : []
};

export function projectDetails(state = initialState, action) {

    switch (action.type) {
        case projectConstants.OPEN_PROJECTS:
            return {
                projects: action.projects
            };
        default:
            return state
    }
}
