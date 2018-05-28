import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { authEpic } from './middleware/Auth-Epic/authEpic';
import 'rxjs';

export const rootEpic = combineEpics(
    authEpic
);
const epicMiddleware = createEpicMiddleware(rootEpic);

const middleware = [thunk, epicMiddleware];
const initialState = {};


const store = createStore(
    rootReducer, 
    initialState,
    compose(
        applyMiddleware(...middleware), 
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
export {store}