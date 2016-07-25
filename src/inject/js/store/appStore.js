//external
import { createStore } from 'redux';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';
import ghApiUtil from '@src/util/apiUtil';


//App Store reducer
const AppReducer = (state, action) => {
	if(!!state){
		//default state
		state = {
			owner : null,
			repo : null,
			branch : null,
			commit : null,//current commit id
			file : null,
			pull : null,
			repoInstance : null, //api instance
			commits : null//list of relavant commits
		}
	}

	if(action.type === 'REFRESH'){
		state = action.value;
	}
}

const AppStore = createStore(AppReducer);


//update self every 3 seconds
setInterval( function(){
	const gitInfo = dataUtil.getGitInfo();
	const newState = {
		owner: gitInfo.owner,
		repo: gitInfo.repo,
		branch: gitInfo.branch,
		commit: gitInfo.commit,
		file: gitInfo.file,
		pull: gitInfo.pull
	}

	newState.repoInstance = (!!gitInfo.owner && !!gitInfo.repo) ? ghApiUtil.getRepo(gitInfo.owner, gitInfo.repo)
		: null;


	if(!!AppStore.repoInstance){
		const listCommitPayload = {
			// sha
			// path
			// author
		};
		//filter out by file name if needed
		if(!!gitInfo.file){
			listCommitPayload.path = gitInfo.file.substr(gitInfo.file.indexOf('/'));
		}
		AppStore.repoInstance.listCommits(listCommitPayload).then(({data : commits}) => {
			newState.commits = commits;
			AppStore.dispatch({
				type: 'REFRESH',
				value : newState
			});
		})
	} else {
		//no owner and repo ready, just set up empty commits
		newState.commits = [];
		AppStore.dispatch({
			type: 'REFRESH',
			value : newState
		});
	}
}, 3000);

export default AppStore;