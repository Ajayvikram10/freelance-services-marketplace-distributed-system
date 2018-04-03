import { combineReducers }  from 'redux';
import { alert }            from './alert.reducer';
import { userDetails }      from "./user.reducer";
import { projectDetails }   from "./project.reducer";

const rootReducer = combineReducers({
    userDetails,
    alert,
    projectDetails
});

export default rootReducer;