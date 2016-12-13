import _ from 'lodash';

const AppAction = {
  refresh : (state) => {
    // init
    return function (dispatch, getState) {
      dispatch({
        type : 'REFRESH',
        value : state
      });

      const apiInstance = _getApiInstance(getState);
      const userInstance = apiInstance.getUser();

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
            dispatch({ type: 'SET_VISIBLE_CONTRIBUTOR_BOX', value: true});
            dispatch({ type: 'SET_VISIBLE_FILE_EXPLORER_BOX', value: true});
            dispatch({ type: 'SET_VISIBLE_COMMIT_BOX', value: true});

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
            dispatch({ type : 'CLEAR_TOKEN' });
          }
        );
    };
  },
  updateApiToken : (value) => {
    return {
      type : 'UPDATE_API_TOKEN',
      value : value
    };
  },
  fetchCommitList: ({path, owner, repo}) => {
    return function (dispatch, getState) {
      const apiInstance = _getApiInstance(getState);

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
  fetchTreeList: ({branch, owner, repo, commit}) => {
    return function (dispatch, getState) {
      //fetch trees
      const apiInstance = _getApiInstance(getState);

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        alert(branch)
        alert(commit)

        dispatch({ type: 'SET_LOADING_FILE_EXPLORER_BOX', value: true});

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
      const apiInstance = _getApiInstance(getState);

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


function _getApiInstance(getState){
  return getState().data.apiInstance;
}

export default AppAction;
