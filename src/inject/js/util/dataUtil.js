const dataUtil = {
	getGitInfo() {
    	var pathName = location.pathname;
    	var urlSplits = pathName.split('/');
    	var owner;
    	var repo;

    	if(urlSplits[1] !== 'pulls'){
    		owner = urlSplits[1];
    		repo = urlSplits[2];
    	}

    	var branch = 'master';
    	if(pathName.indexOf('/blob/') >= 0 || pathName.indexOf('/tree/') >= 0 && urlSplits.length >= 5){
    		branch = urlSplits[4];
    	}

    	var commit;
    	if(pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0){
    		commit = urlSplits[urlSplits.length - 1];
    	}


    	var file;
    	if(pathName.indexOf('/blob/') >= 0){
    		file = urlSplits.slice(5).join('/');
    	}


    	var pull;
		if(pathName.indexOf('/pull/') >= 0 && pathName.indexOf('/files') >= 0){
    		pull = urlSplits[urlSplits.length - 2];
    	}


    	return {
    		owner, repo, branch, commit, file, pull
    	};
    },
    getVisibleFlags() {
    	var gitInfo = dataUtil.getGitInfo();

    	return {
    		differ : !!(gitInfo.owner && gitInfo.repo) && !!(gitInfo.commit || gitInfo.pull),
    		searchFile : !!(gitInfo.owner && gitInfo.repo)
    	};
    },
    getSupportedLanguages() {
    	return [
			'css',
			'scss',
			'html',
			'js',
			'json',
			'xml',
			'java'
    	]
	}
}

export default dataUtil;