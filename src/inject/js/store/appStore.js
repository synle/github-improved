//external
import { createStore } from 'redux';
import GitHub from 'github-api';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';



//App Store reducer
const AppReducer = (state, {type, value}) => {
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
            },
            apiToken: dataUtil.getPersistedProp('api-token')
		};

        state.apiInstance = new GitHub({
           token: state.apiToken
        })
	}

    switch(type){
        case 'REFRESH':
            state = value;
            break;
        case 'UPDATE_API_TOKEN':
            state.apiToken = action.value;
            state.apiInstance = new GitHub({
               token: state.apiToken
            })
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

    return Object.assign({}, state);
}

export default AppReducer;
