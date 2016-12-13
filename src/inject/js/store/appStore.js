//external
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import GitHub from 'github-api';


//internal
import repoReducer from '@src/store/repoReducer';
import uiStateReducer from '@src/store/uiStateReduder';

//combine the reducer
const AppReducer = combineReducers({
    repo : repoReducer,//the repo info
    ui : uiStateReducer//the ui state
});


const logger = createLogger();
const AppStore = createStore( AppReducer, applyMiddleware(thunk, logger) );

export default AppStore;
