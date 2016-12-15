import _ from 'lodash';

//external
import GitHub from 'github-api';
// https://www.npmjs.com/package/github-api
// https://github.com/github-tools/github
// http://github-tools.github.io/github/

//internal
import dataUtil from '@src/util/dataUtil';


let apiToken = dataUtil.getPersistedProp('api-token');
let apiInstance;
if(apiToken){
  apiInstance = new GitHub({
    token: apiToken
  })
}

const AppAction = {
  init : (state) => {
    // init
    return function (dispatch, getState) {
      dispatch({
        type : 'REFRESH',
        value : state
      });

      //trigger refresh
      AppAction.refresh()(dispatch, getState);
    };
  },
  refresh : () => {
    // init
    return function (dispatch, getState) {
      const userInstance = apiInstance.getUser();

      const state = _.get(getState(), 'repo');

      const owner = _.get( state, 'owner');
      const branch = _.get( state, 'branch');
      const repo = _.get( state, 'repo');
      const path = _.get( state, 'path');
      const commit = _.get( state, 'commit');
      const isPullRequestPage = _.get( state, 'isPullRequestPage');

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
              AppAction.fetchCommitList( { path, owner, branch, repo, commit, isPullRequestPage } ),
              AppAction.fetchContributorList( { path, owner, branch, repo, commit, isPullRequestPage } )
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
  fetchCommitList: ({path, owner, branch, repo, commit, isPullRequestPage}) => {
    return function (dispatch, getState) {
      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );


        if(isPullRequestPage){
          //fetch commits based on PR
        } else {
          //fetch commits based on commit hash
          const listCommitPayload = {
            // sha
            // path
            // author
          };
          //filter out by file name if needed
          if(!!path){
            listCommitPayload.path = path;
          }

          dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: true});

          repoInstance.listCommits( listCommitPayload ).then(
            resp => {
              dispatch({ type: 'SET_LOADING_COMMIT_BOX', value: false});

              dispatch({
                type : 'UPDATE_COMMIT_LIST',
                value : resp.data
              })


              commit = commit || resp.data[0].sha;

              AppAction.fetchTreeList( { path, owner, branch, repo, commit } )(dispatch, getState);
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
      }
    };
  },
  fetchTreeList: ({branch, owner, repo, commit, path}) => {
    return function (dispatch, getState) {
      //fetch trees

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: true});


        var request = new Request(`https://github.com/${owner}/${repo}/tree-list/${commit}`, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            cache: "no-cache",
            credentials: "include",
            headers: new Headers({
              "Accept": "application/json"
            })
        });

        fetch(request).then(
            resp => {
              return resp.ok ? resp.json() : {};
            }
          ).then(
            resp => {
              dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});

              dispatch({
                type : 'UPDATE_TREE_LIST',
                value : resp.paths || []
              })
            }
          )
      }
    }
  },
  fetchContributorList: ({owner, repo}) => {
    return function(dispatch, getState){
      //fetch contributors

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );
        dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: true});
        repoInstance.getContributors().then(
          resp => {
            dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: false});
            dispatch({
              type : 'UPDATE_CONTRIBUTOR_LIST',
              value : resp.data
            })
          },
          () => {
            dispatch({ type: 'SET_LOADING_CONTRIBUTOR_BOX', value: false});
            dispatch({
              type : 'UPDATE_CONTRIBUTOR_LIST',
              value : []
            })
          }
        );
      }
    }
  }
}


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
