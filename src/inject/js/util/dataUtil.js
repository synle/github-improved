import _ from 'lodash';

const dataUtil = {
	getGitInfo() {
    	var pathName = location.pathname;
    	var urlSplits = pathName.split('/');
    	var owner = $('.repohead-details-container [itemprop="author"]').text();
    	var repo = $('.repohead-details-container [itemprop="name"]').text();

    	var branch = $('.branch-select-menu .select-menu-button').attr('title');
    	if(!branch){
    		branch = 'master';
    	}

    	var commit = $('.sha.user-select-contain').text();
    	if(!commit && (pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0)){
    		commit = urlSplits[urlSplits.length - 1];
    	}

    	var file = _.trim($('.file-navigation .breadcrumb').text());

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