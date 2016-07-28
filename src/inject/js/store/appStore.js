//external
import { createStore } from 'redux';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';


//App Store reducer
const AppReducer = (state, {type, value}) => {
	console.error('Before 1', type);
	console.error('Before 2', value);
	console.error('Before 3', state);

	if(!state){
		//default state
		state = {
			owner : null,
			repo : null,
			branch : null,
			commit : null,//current commit id
			file : null,
			pull : null,
			commits : null,//list of relavant commits
            contributors : null,// list of contributors
            trees: null,//tree map
            urlParams: {},
            visible: {
                contributor : false,
                fileExplorer : false,
                commit : false
            }
		}
	}

    switch(type){
        case 'REFRESH':
            state = value;
            break;
        case 'UPDATE_COMMIT_LIST':
        	state.commits = value;
        	break;

    	case 'UPDATE_TREE_LIST':
            state.trees = value;
        	break;

    	case 'UPDATE_CONTRIBUTOR_LIST':
    		state.contributors = value;
        	break;
    }

    console.error('After 1', type);
    console.error('After 2', state);

    return state;
}

export default AppReducer;
