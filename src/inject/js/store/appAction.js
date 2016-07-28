export default {
    refresh : (value) => {
    	return function(dispatch){
    		return dispatch({
		        type : 'REFRESH',
		        value : value
		    });
    	}
    },
    updateApiToken : (value) => {
    	return function(dispatch){
    		return dispatch({
		        type : 'UPDATE_API_TOKEN',
		        value : value
		    });
    	}
    },
	fetchCommitList: (path, repoInstance) => {
		return function (dispatch, getState){
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
		};
	},
	fetchTreeList: (branch, repoInstance) => {
		return function (dispatch, getState) {
			//fetch trees
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
	},
	fetchContributorList: (repoInstance) => {
		return function(dispatch, getState){
			//fetch contributors
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
