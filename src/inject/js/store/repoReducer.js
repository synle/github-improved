//lib
import _ from 'lodash';

//internal
import dataUtil from '@src/util/dataUtil';



//App Store reducer
const RepoReducer = (state, {type, value}) => {
  if(!state){
    //default state
    state = {
      owner : null,
      path: null,
      repo : null,
      branch : null,
      commit : null,//current commit id
      file : null,
      pull : null,
      isPullRequestPage: false, // whether or not in pull request mode
      commits : null,//list of relavant commits
      contributors : null,// list of contributors
      trees: null,//tree map
      urlParams: {}
    };
  }

  switch(type){
    case 'REFRESH':
      state = value;
      break;

    case 'UPDATE_COMMIT_LIST':
      state.commits = value;

      // compose the display commit message (friendly for ui)
      state.commits = state.commits.map( commit => {
        commit.displayCommitMsg = _.truncate( commit.message, {
          length: 140,
          omission : '...'
        })
        return commit;
      });
      break;

    case 'UPDATE_TREE_LIST':
      state.trees = value;
      break;

    case 'UPDATE_CONTRIBUTOR_LIST':
      state.contributors = value;
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default RepoReducer;
