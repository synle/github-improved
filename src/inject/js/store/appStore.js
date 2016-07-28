//external
import { createStore } from 'redux';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';


//App Store reducer
const AppReducer = (state, action) => {
	console.error('AppReducer', action.type, action.value, state);
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

    switch(action.type){
        case 'REFRESH':
            state = action.value;
            break;
        case 'UPDATE_COMMIT_LIST':
        	state.commits = action.value;
        	break;

    	case 'UPDATE_TREE_LIST':
            //fetch trees
            //filter out by file name if needed
            // if(!!state.path){
            //     listCommitPayload.path = state.path;
            // }
            state.repoInstance.getTree( state.branch ).then(({data : trees}) => {
                // deferredTrees.resolve( state.trees = trees);
            });
        	break;

    	case 'UPDATE_CONTRIBUTOR_LIST':
            //fetch contributors
            state.repoInstance.getContributors().then(({data : contributors}) => {
                // deferredContribs.resolve( state.contributors = contributors );
            });
        	break;
    }

    return state;
}

export default AppReducer;
