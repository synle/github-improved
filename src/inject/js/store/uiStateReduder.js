//external
import GitHub from 'github-api';

//App Store reducer
const UIStateReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {
      visible: {
        contributorBox : false,
        fileExplorer : false,
        commitBox : false
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
    case 'SET_VISIBLE_contributorBox':
      state.visible.contributorBox = value;
      break;
    case 'SET_VISIBLE_FILE_EXPLORER':
      state.visible.fileExplorer = value;
      break;
    case 'SET_VISIBLE_COMMIT':
      state.visible.commitBox = value;
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default UIStateReducer;
