//external
import { createStore } from 'redux';
import GitHub from 'github-api';

//internal
import dataUtil from '@src/util/dataUtil';

//App Store reducer
const apiStore = (state, action) => {
	if(!state){
		//default state
		state = {
            apiToken: dataUtil.getPersistedProp('api-token')
		}
        state.apiInstance = new GitHub({
           token: state.apiToken
        })
	}

    switch(action.type){
        case 'UPDATE_API_TOKEN':
            state.apiToken = action.value;
            state.apiInstance = new GitHub({
               token: state.apiToken
            })
            break;
    }

    return state;
}

export default apiStore;
