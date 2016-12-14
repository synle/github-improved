//external
import GitHub from 'github-api';

//App Store reducer
const UIStateReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {
      isAuthenticated: false,
      visible: {
        contributorBox : false,
        fileExplorer : false,
        commitBox : false,
        tokenRequestForm: false
      },
      loading: {
        contributorBox : true,
        fileExplorer : true,
        commitBox : true
      }
    };
  }

  switch(type){
    case 'CLEAR_TOKEN':
      // when token is cleared, then hide all of these
      state.visible.contributorBox = false;
      state.visible.fileExplorer = false;
      state.visible.commitBox = false;
      break;
    case 'SET_VISIBLE_CONTRIBUTOR_BOX':
      state.visible.contributorBox = value;
      break;
    case 'SET_VISIBLE_FILE_EXPLORER_BOX':
      state.visible.fileExplorer = value;
      break;
    case 'SET_VISIBLE_COMMIT_BOX':
      state.visible.commitBox = value;
      break;
    case 'SET_LOADING_CONTRIBUTOR_BOX':
      state.loading.contributorBox = value;
      break;
    case 'SET_LOADING_FILE_EXPLORER_BOX':
      state.loading.fileExplorer = value;
      break;
    case 'SET_LOADING_COMMIT_BOX':
      state.loading.commitBox = value;
      break;
    case 'SET_TOKEN_VALID':
      state.isAuthenticated = value;
      state.visible.tokenRequestForm = !state.isAuthenticated;
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default UIStateReducer;
