import _ from 'lodash';

const AppAction = {
  refresh : (value) => {
    return {
      type : 'REFRESH',
      value : value
    };
  },
  updateApiToken : (value) => {
    return {
      type : 'UPDATE_API_TOKEN',
      value : value
    };
  },
  initApi: () => {
    return function (dispatch, getState) {
      const state = getState();
      const apiInstance = _.get( state, 'data.apiInstance');
      const userInstance = apiInstance.getUser();

      let hasError = false;
      userInstance.getProfile()
        .then(
          (resp) => {
            // success
            // dispatch({
            //   type : 'CLEAR_TOKEN'
            // })
            // AppStore.dispatch(
            //     AppAction.fetchCommitList(
            //         gitInfo.path
            //     )
            // );


            // AppStore.dispatch(
            //     AppAction.fetchContributorList()
            // );


            // AppStore.dispatch(
            //     AppAction.fetchTreeList(
            //         newState.branch
            //     )
            // );
          },
          (resp) => {
            //failure
            dispatch({
              type : 'CLEAR_TOKEN'
            })
          }
        );
    };
  },
  fetchCommitList: (path) => {
    return function (dispatch, getState) {
      const state = getState();
      const owner = _.get( state, 'repo.owner');
      const repo = _.get( state, 'repo.repo');
      const apiInstance = _.get( state, 'data.apiInstance');

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

        repoInstance.listCommits( listCommitPayload ).then(
          resp => {
            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : resp.data
            })
          },
          () => {
            dispatch({
              type : 'UPDATE_COMMIT_LIST',
              value : []
            })
          }
        );
      }
    };
  },
  fetchTreeList: (branch) => {
    return function (dispatch, getState) {
      //fetch trees
      const state = getState();
      const owner = _.get( state, 'repo.owner');
      const repo = _.get( state, 'repo.repo');
      const apiInstance = _.get( state, 'data.apiInstance');

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );

        repoInstance.getTree( branch ).then(
          resp => {
            dispatch({
              type : 'UPDATE_TREE_LIST',
              value : resp.data
            })
          },
          () => {
            dispatch({
              type : 'UPDATE_TREE_LIST',
              value : []
            })
          }
        );
      }
    }
  },
  fetchContributorList: (repoInstance) => {
    return function(dispatch, getState){
      //fetch contributors
      const state = getState();
      const owner = _.get( state, 'repo.owner');
      const repo = _.get( state, 'repo.repo');
      const apiInstance = _.get( state, 'data.apiInstance');

      if(!!owner && !!repo && !!apiInstance){
        const repoInstance = apiInstance.getRepo( owner, repo );
        repoInstance.getContributors().then(
          resp => {
            dispatch({
              type : 'UPDATE_CONTRIBUTOR_LIST',
              value : resp.data
            })
          },
          () => {
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


export default AppAction;
