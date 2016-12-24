//external
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import GitHub from 'github-api';


//internal
import repoReducer from '@src/store/repoReducer';
import uiStateReducer from '@src/store/uiStateReduder';
import AppEnvironment from 'app_environment';

//combine the reducer
const AppReducer = combineReducers({
    repo : repoReducer,//the repo info
    ui : uiStateReducer//the ui state
});

// middlewares to use
const middlewaresToUse = [thunk];

if(AppEnvironment.ENV !== 'prod'){
    // middlewares which are only available in dev mode
    middlewaresToUse.push( createLogger() ); // logging middlewares...
}

const AppStore = createStore( AppReducer, applyMiddleware.apply(null, middlewaresToUse) )

export default AppStore;
