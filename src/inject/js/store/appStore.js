//external
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import GitHub from 'github-api';


//internal
import dataReducer from '@src/store/dataReducer';
import repoReducer from '@src/store/repoReducer';
import uiStateReducer from '@src/store/uiStateReduder';

//combine the reducer
const AppReducer = combineReducers({
    data : dataReducer,//api related
    repo : repoReducer,//the repo info itself
    ui : uiStateReducer//the repo info itself
});


const logger = createLogger();
const AppStore = createStore( AppReducer, applyMiddleware(thunk, logger) );

export default AppStore;
