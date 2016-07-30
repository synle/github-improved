//external
import GitHub from 'github-api';

//internal
import dataUtil from '@src/util/dataUtil';

//App Store reducer
const DataReducer = (state, {type, value}) => {
	if(!state){
		//default state
		state = {
            apiToken: dataUtil.getPersistedProp('api-token')
		};

        state.apiInstance = new GitHub({
           token: state.apiToken
        })
	}

    switch(type){
        case 'UPDATE_API_TOKEN':
            state.apiToken = value;
            state.apiInstance = new GitHub({
               token: state.apiToken
            })
            break;
    }


    console.log('data', type, value, state);

    return state;
}

export default DataReducer;