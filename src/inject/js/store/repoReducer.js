//lib
import _ from 'lodash';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';

//default state
const DEFAULT_STATE = {
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
  explorerFilesPrMode: null,
  explorerFilesFileMode: null, // file explorer
  pullRequests: null, // current pull requests...
  urlParams: {}
};

//App Store reducer
const RepoReducer = (state = DEFAULT_STATE, {type, value, mode}) => {
  switch(type){
    case 'REFRESH':
      state = value;
      break;

    case 'UPDATE_COMMIT_LIST':
      state.commits = value;

      // ui transformation
      state.commits = state.commits.map( repoCommit => {
        // the display commit message (friendly for ui)
        repoCommit.displayCommitMsg = _.truncate(
          _.get(repoCommit, 'commit.message', ''),
          {
            length: 140,
            omission : '...'
          }
        );

        //commit url
        repoCommit.commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);

        //commit authors
        repoCommit.commitDate = _.get( repoCommit, 'commit.author.date');
        repoCommit.commitAuthorName = _.get( repoCommit, 'commit.author.name', '');

        // only pick up the first 2 initials...
        repoCommit.commitAuthorShortName = dataUtil.getInitialFromName(repoCommit.commitAuthorName);

        return repoCommit;
      });
      break;

    case 'UPDATE_TREE_LIST':
      //tree list used for the explorer
      state.trees = value;
      break;

    case 'UPDATE_EXPLORER_FILE_LIST_PR_MODE':
      state.explorerFilesPrMode = value;
      break;

    case 'UPDATE_EXPLORER_FILE_LIST_EXPLORER_MODE':
      state.explorerFilesFileMode = value;
      break;

    case 'UPDATE_CONTRIBUTOR_LIST':
      state.contributors = value;
      break;

    case 'UPDATE_PULL_REQUEST_LIST':
      state.pullRequests = value;
      break;
  }

  return Object.assign(
    {},
    state
  );
}

export default RepoReducer;
