import { projectConstants }    from "../../../helper/constants";

export const projectActions = {
    openProjectsR,
    clearProjects
};

function openProjectsR(projects) {
    return {
        type        : projectConstants.OPEN_PROJECTS,
        projects    : projects
    };
}

function clearProjects() {
    return {
        type        : projectConstants.CLEAR_PROJECTS,
    };
}