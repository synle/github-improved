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

      let hasError = false;
      userInstance.getProfile()
        .then(
          resp => {
            // success
            // set visible
            dispatch({ type: 'SET_VISIBLE_CONTRIBUTOR_BOX', value: _shouldShowContributorBox()});
            dispatch({ type: 'SET_VISIBLE_FILE_EXPLORER_BOX', value: _shouldShowFileExplorerBox()});
            dispatch({ type: 'SET_VISIBLE_COMMIT_BOX', value: _shouldShowCommitBox(commit)});

            // set token valid
            dispatch({ type: 'SET_TOKEN_VALID', value: true});

            //trigger async dispatch
            [
              AppAction.fetchCommitList( { path, owner, branch, repo, commit } ),
              AppAction.fetchContributorList( { path, owner, branch, repo, commit } ),
              AppAction.fetchTreeList( { path, owner, branch, repo, commit } )
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
  fetchCommitList: ({path, owner, repo}) => {
    return function (dispatch, getState) {

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        //fetch commits
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
    };
  },
  fetchTreeList: ({branch, owner, repo, commit, path}) => {
    return function (dispatch, getState) {
      //fetch trees

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: true});


        repoInstance.getContents(commit || branch, path).then(
            resp => { 'aa11', console.log(resp) },
            resp => { 'aa22', console.log(resp) }
          )

        repoInstance.getTree( commit || branch ).then(
          resp => {
            dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});

            dispatch({
              type : 'UPDATE_TREE_LIST',
              value : resp.data
            })
          },
          () => {
            dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: false});

            dispatch({
              type : 'UPDATE_TREE_LIST',
              value : []
            })
          }
        );
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
  var pathName = location.pathname;
  var urlSplits = pathName.split('/').filter(url => !!url);
  return urlSplits.length === 2;
}

function _shouldShowFileExplorerBox(){
  var pathName = location.pathname;
  var urlSplits = pathName.split('/').filter(url => !!url);
  return urlSplits.length === 2;
}


function _shouldShowCommitBox(sha){
  return !sha || sha.length === 0;
}

export default AppAction;
