export default {
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
	fetchCommitList: (path) => {
		return function (dispatch, getState) {
			const repoInstance = getState().repoInstance;

			if(!!repoInstance){
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
			const repoInstance = getState().repoInstance;
			if(!!repoInstance){
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
			const repoInstance = getState().repoInstance;
			if(!!repoInstance){
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
