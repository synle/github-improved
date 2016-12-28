//external
import GitHub from 'github-api';

//internal
import dataUtil from '@src/util/dataUtil';

//App Store reducer
const UIStateReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {
      isAuthenticated: false,
      isSideBarExpanded: true,
      visible: {
        contributorBox : false,
        fileExplorer : false,
        commitBox : false,
        tokenRequestForm: false,
        searchBox: false,
        prNavBox: false,
        diffOptionBox: false
      },
      loading: {
        contributorBox : true,
        fileExplorer : true,
        commitBox : true
      }
    };
  }

  switch(type){
    case 'SET_TOKEN_VALID':
      state.isAuthenticated = value;
      state.visible.tokenRequestForm = !state.isAuthenticated;
      break;
    // visible flags
    case 'SET_VISIBLE_CONTRIBUTOR_BOX':
      state.visible.contributorBox = value;
      break;
    case 'SET_VISIBLE_FILE_EXPLORER_BOX':
      state.visible.fileExplorer = value;
      break;
    case 'SET_VISIBLE_COMMIT_BOX':
      state.visible.commitBox = value;
      break;
    case 'SET_VISIBLE_SEARCH_BOX':
      state.visible.searchBox = value;
      break;
    case 'SET_VISIBLE_PR_NAVIGATION_BOX':
      state.visible.prNavBox = value;
      break;
    case 'SET_VISIBLE_DIFF_OPTION_BOX':
      state.visible.diffOptionBox = value;
      break;
    // loading flags
    case 'SET_LOADING_CONTRIBUTOR_BOX':
      state.loading.contributorBox = value;
      break;
    case 'SET_LOADING_FILE_EXPLORER_BOX':
      state.loading.fileExplorer = value;
      break;
    case 'SET_LOADING_COMMIT_BOX':
      state.loading.commitBox = value;
      break;
    case 'TOGGLE_SIDE_BAR_VISIBILITY':
      state.isSideBarExpanded = !state.isSideBarExpanded;

      // toggle sidebar
      document.querySelector('#side-bar-body').classList.toggle(
        'collapsed-side-bar',
        !state.isSideBarExpanded
      );
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default UIStateReducer;
