import _ from 'lodash';

const dataUtil = {
	getGitInfo() {
    	var pathName = location.pathname;
    	var urlSplits = pathName.split('/');
    	var owner = $('.repohead-details-container [itemprop="author"]').text();
    	var repo = $('.repohead-details-container [itemprop="name"]').text();

    	// var branch = $('.branch-select-menu .select-menu-button').attr('title');
    	// if(!branch){
    	// 	branch = 'master';
    	// }

    	//get branch
		const GH_BRANCH_SEL_1 = '[aria-label="Switch branches or tags"]'
		const GH_BRANCH_SEL_2 = '.repo-root a[data-branch]'
		const GH_BRANCH_SEL_3 = '.repository-sidebar a[aria-label="Code"]'
		const GH_BRANCH_SEL_4 = '.current-branch'
		const GH_BRANCH_SEL_5 = 'link[title*="Recent Commits to"]'
		const branch =
			// Detect branch in code page
			$(GH_BRANCH_SEL_1).attr('title') || $(GH_BRANCH_SEL_2).data('branch') ||
			// Non-code page (old GH design)
			($(GH_BRANCH_SEL_3).attr('href') || ' ').match(/([^\/]+)/g)[3] ||
			// Non-code page: commit page
			($(GH_BRANCH_SEL_4).attr('title') || ' ').match(/([^\:]+)/g)[1] ||
			// Non-code page: others
			($(GH_BRANCH_SEL_5).length === 1 && ($(GH_BRANCH_SEL_5).attr('title') || ' ').match(/([^\:]+)/g)[1])



    	var commit = $('.sha.user-select-contain').text();
    	if(!commit && (pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0)){
    		commit = urlSplits[urlSplits.length - 1];
    	}

    	var file = _.trim($('.file-navigation .breadcrumb').text());
        var path = !!file ? file.substr( file.indexOf('/') ) : null;

    	var pull;
		if(pathName.indexOf('/pull/') >= 0 && pathName.indexOf('/files') >= 0){
    		pull = urlSplits[urlSplits.length - 2];
    	}


    	return {
    		owner, repo, branch, commit, file, pull, path
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
	},
    getPersistedProp(key){
        return localStorage[`github-improved.${key}`]
    },
    setPersistedProp(key, value){
        localStorage[`github-improved.${key}`] = value;
        return localStorage[`github-improved.${key}`];
    }
}

export default dataUtil;
