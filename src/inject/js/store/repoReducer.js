//internal
import dataUtil from '@src/util/dataUtil';



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
      }
    };
  }

  switch(type){
    case 'REFRESH':
      state = Object.assign({}, state, value);
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

  return state;
}

export default AppReducer;
