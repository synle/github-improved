import _ from 'lodash';

//external
import GitHub from 'github-api';
// https://www.npmjs.com/package/github-api
// https://github.com/github-tools/github
// http://github-tools.github.io/github/

//internal
import dataUtil from '@src/util/dataUtil';
import restUtil from '@src/util/restUtil';


let apiToken = dataUtil.getPersistedProp('api-token');
let apiInstance;
if(apiToken){
  // instances...
  apiInstance = new GitHub({
    token: apiToken
  });

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
      if(!apiInstance){
        //api instance is not available, then return
        dispatch({ type: 'SET_TOKEN_VALID', value: false});
        return;
      }

      const userInstance = apiInstance.getUser();

      const state = _.get(getState(), 'repo');

      const owner = _.get( state, 'owner');
      const branch = _.get( state, 'branch');
      const repo = _.get( state, 'repo');
      const path = _.get( state, 'path');
      const commit = _.get( state, 'commit');
      const isPullRequestPage = _.get( state, 'isPullRequestPage');
      const pullRequestNumber = _.get( state, 'pullRequestNumber');

      let hasError = false;
      userInstance.getProfile()
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
          },
          resp => {
            //failure
            apiInstance = null;
            apiToken = null;


            // set token valid
            dispatch({ type: 'SET_TOKEN_VALID', value: false});
          }
        );
    };
  },
  updateApiToken : (value) => {
    apiToken = value;
    apiInstance = new GitHub({
      token: apiToken
    });

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
      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

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
      }
    };
  },
  fetchCommitListByPrDetails: ({path, owner, branch, repo, commit, pullRequestNumber}) => {
    return function (dispatch, getState) {
      dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});
      dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});
      // dispatch({ type: 'SET_VISIBLE_COMMIT_BOX', value: false});
      dispatch({ type: 'SET_VISIBLE_FILE_EXPLORER_BOX', value: false});

      dataUtil.fetchCommitListByPrDetails(owner, repo, pullRequestNumber)
        .then(
          resp => {
            dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});

            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : resp
            })

            // TODO: figure this out
            // trigger fetch tree list using the most recent commit
            // commit = commit || resp.data[0].sha;
            // AppAction.fetchTreeListBySha( { path, owner, branch, repo, commit } )(dispatch, getState);
          },
          () => {
            dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});

            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : []
            })
          }
        );
    }
  },
  fetchCommitListBySha: ({path, owner, branch, repo, commit}) => {
    return function (dispatch, getState) {
      if(!!owner && !!repo && !!apiInstance){
        dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: true});

        dataUtil.fetchCommitListBySha(owner, repo, path)
          .then(
            resp => {
              dispatch({
                type : 'UPDATE_COMMIT_LIST',
                value : resp
              })

              // trigger fetch tree list using the most recent commit
              commit = commit || resp[0].sha;
              AppAction.fetchTreeListBySha( { path, owner, branch, repo, commit } )(dispatch, getState);
            }
          )
          .catch(
            () => {
              dispatch({
                type : 'UPDATE_COMMIT_LIST',
                value : []
              })
            }
          )
          .then(
            //finally
            () => {
              dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});
            }
          );
      }
    };
  },
  fetchTreeListByPrDetails: ({branch, owner, repo, commit, path, pullRequestNumber}) => {
    return function (dispatch, getState) {
    }
  },
  fetchTreeListBySha: ({branch, owner, repo, commit, path}) => {
    return function (dispatch, getState) {
      //fetch trees

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: true});


        dataUtil.fetchTreeListBySha(owner, repo, commit)
          .then(
            resp => {
              dispatch({
                type : 'UPDATE_TREE_LIST',
                value : _.get(resp, 'paths') || []
              })
            }
          )
          .catch(
            resp => {
              dispatch({
                type : 'UPDATE_TREE_LIST',
                value : []
              })
            })
          .then(
            () => {
              //finally
              dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});
            }
          );
      }
    }
  },
  fetchContributorList: ({owner, repo}) => {
    return function(dispatch, getState){
      //fetch contributors
      if(!!owner && !!repo && !!apiInstance){
        dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: true});

        dataUtil.fetchContributorList(owner, repo)
          .then(
            resp => {
              dispatch({
                type : 'UPDATE_CONTRIBUTOR_LIST',
                value : resp
              })
            }
          )
          .catch(
            () => {
              dispatch({
                type : 'UPDATE_CONTRIBUTOR_LIST',
                value : []
              })
            }
          )
          .then(
            () => {
              dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: false});
            }
          )
      }
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
