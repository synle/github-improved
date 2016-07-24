import dataUtil from './dataUtil';
import util from './globalUtil';

var urlUtil = {
    getDiffNonWhitespaceUrl: function() {
    	var urlParams = util.getUrlVars();
    	urlParams.w = 1;
        return util.getUrlForParam(urlParams);
    },
    getDiffWithWhitespaceUrl: function() {
        var urlParams = util.getUrlVars();
    	urlParams.w = 0;
        return util.getUrlForParam(urlParams);
    },
    getSplitDiffUrl: function(){
    	var urlParams = util.getUrlVars();
    	urlParams.diff = 'split';
        return util.getUrlForParam(urlParams);
    },
    getUnifiedDiffUrl: function(){
    	var urlParams = util.getUrlVars();
    	urlParams.diff = 'unified';
        return util.getUrlForParam(urlParams);
    },
    getSearchUrl : function(){
    	var gitInfo = dataUtil.getGitInfo();
    	var owner = gitInfo.owner;
    	var repo = gitInfo.repo;
    	var branch = gitInfo.branch;

    	return 'https://' + location.hostname + '/' + owner + '/' + repo + '/find/' + branch
    }, 
    getOwnPRUrl : function(){
    	return 'https://github.com/pulls';
    },
    getAssignedPRUrl : function(){
    	return 'https://github.com/pulls/assigned';
    },
    getMentioningPRUrl : function() {
    	return 'https://github.com/pulls/mentioned';
    },
    getRepoSearchResultUrl : function(keyword, language, searchIn, author){
    	var gitInfo = dataUtil.getGitInfo();
    	var owner = gitInfo.owner;
    	var repo = gitInfo.repo;
    	// var branch = gitInfo.branch;


    	var urlParams = {
    		q : `${keyword} in:${searchIn}`
    	};

    	if(!!language){
    		urlParams.q += ` extension:${language}`;
    	}

    	if(!!author){
    		urlParams.q += ` user:${author}`;
    	}

    	// https://github.com/relateiq/riq/search?q=test&utf8=%E2%9C%93
    	// https://github.com/search?l=json&q=octocat+in%3Afile%2Cpath&type=Code

    	var searchQueryString = util.getSerializedQueryString(urlParams);

    	return 'https://' + location.hostname + '/' + owner + '/' + repo + '/search?' + searchQueryString;
    }
}

export default urlUtil;