//external
import GitHub from 'github-api';

//App Store reducer
const UIStateReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {};
  }

  switch(type){
    case 'REFRESH':
      break;
  }

  return state;
}

export default UIStateReducer;
