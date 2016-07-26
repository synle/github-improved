//external
import { createStore } from 'redux';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';
import ghApiUtil from '@src/util/apiUtil';


//App Store reducer
const AppReducer = (state, action) => {
	if(!state){
		//default state
		state = {
			owner : null,
			repo : null,
			branch : null,
			commit : null,//current commit id
			file : null,
			pull : null,
			repoInstance : null, //api instance
			commits : null,//list of relavant commits
            contributors : null,// list of contributors
            trees: null,//tree map
            urlParams: {},
            visible: {
                contributor : false,
                fileExplorer : false,
                commit : false
            },
            apiToken: null
		}
	}

    switch(action.type){
        case 'REFRESH':
            state = action.value;
            break;
        case 'UPDATE_API_TOKEN':
            state = action.value;
            break;
    }

    return state;
}

export default AppReducer;
