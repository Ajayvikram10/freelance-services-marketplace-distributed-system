import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import { createLogger }                 from 'redux-logger';
import combinedReducer                      from '../reducers/combined.reducer';
import { composeWithDevTools }          from 'redux-devtools-extension';

const loggerMiddleware = createLogger();

export const store = createStore(
    combinedReducer,
    composeWithDevTools(applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    ))
);

