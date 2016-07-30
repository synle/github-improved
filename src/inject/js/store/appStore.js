//external
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import GitHub from 'github-api';

//internal
import dataReducer from '@src/store/dataReducer';
import repoReducer from '@src/store/repoReducer';


//combine the reducer
const AppReducer = combineReducers({
	data : dataReducer,//api related
	repo : repoReducer//the repo info itself
});

const AppStore = createStore( AppReducer, applyMiddleware(thunk) );

export default AppStore;