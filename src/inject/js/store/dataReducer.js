//external
import GitHub from 'github-api';
// https://www.npmjs.com/package/github-api
// https://github.com/github-tools/github
// http://github-tools.github.io/github/

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
      });
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default DataReducer;
