//external
import GitHub from 'github-api';

//App Store reducer
const DataReducer = (state, {type, value}) => {
	if(!state){
		//default state
		state = {
            
		};
	}

    switch(type){
        case 'UPDATE_API_TOKEN':
            break;
    }


    console.log('uistate', type, value, state);

    return state;
}

export default DataReducer;