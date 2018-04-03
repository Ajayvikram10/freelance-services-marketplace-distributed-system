import { projectConstants }    from "../../../helper/constants";

export const projectActions = {
    openProjectsR
};

function openProjectsR(projects) {
    return {
        type        : projectConstants.OPEN_PROJECTS,
        projects    : projects
    };
}
