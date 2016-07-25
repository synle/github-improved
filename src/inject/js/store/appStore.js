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
	if(!!state){
		//default state
		state = {
			owner : null,
			repo : null,
			branch : null,
			commit : null,//current commit id
			file : null,
			pull : null,
			repoInstance : null, //api instance
			commits : null//list of relavant commits
		}
	}

	if(action.type === 'REFRESH'){
		state = action.value;
	}

    console.log('reduced called with', action.type, state);
    return state;
}

// const AppStore = createStore(AppReducer);

export default AppReducer;
