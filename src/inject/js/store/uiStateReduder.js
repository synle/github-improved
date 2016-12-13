//external
import GitHub from 'github-api';

//App Store reducer
const DataReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {
      urlParams : '',
      visible : {},
      expand : {}
    };
  }

  switch(type){
    case 'REFRESH':
      break;
  }

  return state;
}

export default DataReducer;
