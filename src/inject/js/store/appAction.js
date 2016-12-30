//external
import _ from 'lodash';

//internal
import dataUtil from '@src/util/dataUtil';
import restUtil from '@src/util/restUtil';


let apiToken = dataUtil.getPersistedProp('api-token');
if(_.size(apiToken) > 0){
  // new rest api
  restUtil.setAuthToken(apiToken);
}

const AppAction = {
  init : (state) => {
    // init
    return function (dispatch, getState) {
      //refersh state
      dispatch({
        type : 'REFRESH',
        value : state
      });

      // side bar expand state
      const isSideBarExpanded = !!dataUtil.getPersistedProp('side-bar-expand');
      AppAction.setSideBarVisibility(isSideBarExpanded)(dispatch, getState);

      //trigger refresh
      AppAction.refresh()(dispatch, getState);
    };
  },
  refresh : () => {
    // init
    return function (dispatch, getState) {
      if(!apiToken){
        //api instance is not available, then return
        return dispatch({ type: 'SET_TOKEN_VALID', value: false});
      }

      const state = _.get(getState(), 'repo');

      const owner = _.get( state, 'owner');
      const branch = _.get( state, 'branch');
      const repo = _.get( state, 'repo');
      const path = _.get( state, 'path');
      const commit = _.get( state, 'commit');
      const isPullRequestPage = _.get( state, 'isPullRequestPage');
      const pullRequestNumber = _.get( state, 'pullRequestNumber');

      let hasError = false;
      dataUtil.fetchUserProfile()
        .then(
          resp => {
            // success
            // set visible
            dispatch({ type: 'SET_VISIBLE_CONTRIBUTOR_BOX', value: _shouldShowContributorBox()});
            dispatch({ type: 'SET_VISIBLE_FILE_EXPLORER_BOX', value: _shouldShowFileExplorerBox()});
            dispatch({ type: 'SET_VISIBLE_COMMIT_BOX', value: _shouldShowCommitBox(commit)});
            dispatch({ type: 'SET_VISIBLE_SEARCH_BOX', value: _shouldShowSearchBox()});
            dispatch({ type: 'SET_VISIBLE_PR_NAVIGATION_BOX', value: _shouldShowPrNavBox()});
            dispatch({ type: 'SET_VISIBLE_DIFF_OPTION_BOX', value: _shouldShowDiffBox()});

            // set token valid
            dispatch({ type: 'SET_TOKEN_VALID', value: true});

            //trigger async dispatch
            [
              AppAction.fetchCommitList( { path, owner, branch, repo, commit, isPullRequestPage, pullRequestNumber } ),
              AppAction.fetchContributorList( { path, owner, branch, repo, commit, isPullRequestPage, pullRequestNumber } )
            ].forEach(function(func){
              func(dispatch, getState);
            });
          }
        )
        .catch(
          resp => {
            //failure
            apiToken = null;

            // set token valid
            dispatch({ type: 'SET_TOKEN_VALID', value: false});
          }
        );
    };
  },
  updateApiToken : (value) => {
    apiToken = value;

    //set api token
    restUtil.setAuthToken(apiToken);

    //persist it
    dataUtil.setPersistedProp('api-token', apiToken);

    //TODO: clean up the reinit
    location.reload();

    return {
      type: 'SET_TOKEN_VALID',
      value: true
    };
  },
  fetchCommitList: ({path, owner, branch, repo, commit, isPullRequestPage, pullRequestNumber}) => {
    return function (dispatch, getState) {
      if(isPullRequestPage){
        //fetch commits based on PR (only applicable when users viewing a PR)
        return AppAction.fetchCommitListByPrDetails(
          {path, owner, branch, repo, commit, pullRequestNumber}
        )(dispatch, getState);
      } else {
        //fetch commit by sha
        return AppAction.fetchCommitListBySha(
          {path, owner, branch, repo, commit}
        )(dispatch, getState);
      }
    };
  },
  fetchCommitListByPrDetails: ({path, owner, branch, repo, commit, pullRequestNumber}) => {
    return function (dispatch, getState) {
      dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});
      dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});
      dispatch({ type: 'SET_VISIBLE_FILE_EXPLORER_BOX', value: false});


      let newCommitInPrList = [];
      dataUtil.fetchCommitListByPrDetails(owner, repo, pullRequestNumber)
        .then(
          resp => {
            newCommitInPrList = resp;

            // trigger fetch tree list using the current pr
            // TODO: figure out how to fetch tree list here...
            AppAction.fetchTreeListByPrDetails(owner, repo, pullRequestNumber)(dispatch, getState);
          }
        ).catch(
          () => newCommitInPrList = []
        ).then(
          () => {
            dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});

            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : newCommitInPrList
            })
          }
        );
    }
  },
  fetchCommitListBySha: ({path, owner, branch, repo, commit}) => {
    return function (dispatch, getState) {
      dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: true});

      let newCommitInBranchList = [];

      dataUtil.fetchCommitListBySha(owner, repo, path)
        .then(
          resp => {
            newCommitInBranchList = resp;

            // trigger fetch tree list using the most recent commit
            commit = commit || _.get(resp, '0.sha');
            AppAction.fetchTreeListBySha( { path, owner, branch, repo, commit } )(dispatch, getState);
          }
        )
        .catch(
          () => newCommitInBranchList = []
        )
        .then(
          //finally
          () => {
            dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});

            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : newCommitInBranchList
            })
          }
        );
    };
  },
  fetchTreeListByPrDetails: ({branch, owner, repo, commit, path, pullRequestNumber}) => {
    return function (dispatch, getState) {
      //TODO: implemented fetch tree list by pr details...
      // TODO: figure this out how to get the list of tree list here...
    }
  },
  fetchTreeListBySha: ({branch, owner, repo, commit, path}) => {
    return function (dispatch, getState) {
      dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: true});

      let newTreeInBranchList = [];

      dataUtil.fetchTreeListBySha(owner, repo, commit)
        .then(
          resp => newTreeInBranchList = _.get(resp, 'paths') || []
        )
        .catch(
          () => newTreeInBranchList = []
        )
        .then(
          () => {
            //finally
            dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});

            dispatch({
              type : 'UPDATE_TREE_LIST',
              value : newTreeInBranchList
            })
          }
        );
    }
  },
  fetchContributorList: ({owner, repo}) => {
    return function(dispatch, getState){
      //fetch contributors
      dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: true});

      let newContributorList = [];

      dataUtil.fetchContributorList(owner, repo)
        .then(
          resp => newContributorList = resp
        )
        .catch(
          () => newContributorList = []
        )
        .then(
          () => {
            //finally
            dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: false});

            dispatch({
              type : 'UPDATE_CONTRIBUTOR_LIST',
              value : newContributorList
            })
          }
        )
    }
  },
  toggleSideBarVisibility: () => {
    return function(dispatch, getState){
      dispatch({
        type: 'SET_SIDE_BAR_VISIBILITY',
        value: !getState().ui.isSideBarExpanded
      });
    };
  },
  setSideBarVisibility: (value) => {
    return function(dispatch, getState){
      dispatch({
        type: 'SET_SIDE_BAR_VISIBILITY',
        value // isSideBarExpanded
      });
    };
  }
}

// private
function _shouldShowContributorBox(){
  if($('.repohead-details-container').length === 0){
    return false;
  }
  const urlSplits = dataUtil.getUrlSplits();
  return urlSplits.length === 2;
}

function _shouldShowFileExplorerBox(){
  if($('.repohead-details-container').length === 0){
    return false;
  }
  const urlSplits = dataUtil.getUrlSplits();
  return urlSplits.length >= 2;
}


function _shouldShowCommitBox(sha){
  if($('.repohead-details-container').length === 0){
    return false;
  }
  const urlSplits = dataUtil.getUrlSplits();
  return (!sha || sha.length === 0) && urlSplits.length >= 2;
}


function _shouldShowSearchBox(){
  if($('.repohead-details-container').length === 0){
    return false;
  }
  const urlSplits = dataUtil.getUrlSplits();
  return urlSplits.length >= 2;
}

function _shouldShowPrNavBox(){
  if($('.repohead-details-container').length === 0){
    return true;
  }

  return false;
}


function _shouldShowDiffBox(){
  return true;
}

export default AppAction;
