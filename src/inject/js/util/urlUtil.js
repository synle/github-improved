import dataUtil from './dataUtil';
import util from './globalUtil';

const urlUtil = {
    getDiffNonWhitespaceUrl: function() {
    	const urlParams = util.getUrlVars();
    	urlParams.w = 1;
        return util.getUrlForParam(urlParams);
    },
    getDiffWithWhitespaceUrl: function() {
        const urlParams = util.getUrlVars();
    	urlParams.w = 0;
        return util.getUrlForParam(urlParams);
    },
    getSplitDiffUrl: function(){
    	const urlParams = util.getUrlVars();
    	urlParams.diff = 'split';
        return util.getUrlForParam(urlParams);
    },
    getUnifiedDiffUrl: function(){
    	const urlParams = util.getUrlVars();
    	urlParams.diff = 'unified';
        return util.getUrlForParam(urlParams);
    },
    getSearchUrl : function(){
    	const gitInfo = dataUtil.getGitInfo();
    	const owner = gitInfo.owner;
    	const repo = gitInfo.repo;
    	const branch = gitInfo.branch;

    	return `https://${location.hostname}/${owner}/${repo}/find/${branch}`;
    }, 
    getOwnPRUrl : function(){
    	return `https://${location.hostname}/pulls`;
    },
    getAssignedPRUrl : function(){
    	return `https://${location.hostname}/pulls/assigned`;
    },
    getMentioningPRUrl : function() {
    	return `https://${location.hostname}/pulls/mentioned`;
    },
    getRepoSearchResultUrl : function(keyword, language, searchIn, author){
    	const gitInfo = dataUtil.getGitInfo();
    	const owner = gitInfo.owner;
    	const repo = gitInfo.repo;
    	// const branch = gitInfo.branch;


    	const urlParams = {
    		q : `${keyword} in:${searchIn}`
    	};

    	if(!!language){
    		urlParams.q += ` extension:${language}`;
    	}

    	if(!!author){
    		urlParams.q += ` user:${author}`;
    	}

    	// https://${location.hostname}/relateiq/riq/search?q=test&utf8=%E2%9C%93
    	// https://${location.hostname}/search?l=json&q=octocat+in%3Afile%2Cpath&type=Code

    	const searchQueryString = util.getSerializedQueryString(urlParams);

    	return `https://${location.hostname}/${owner}/${repo}/search?${searchQueryString}`;
    },
    getCommitByAuthorUrl(user){
    	const gitInfo = dataUtil.getGitInfo();
    	const owner = gitInfo.owner;
    	const repo = gitInfo.repo;
    	const branch = gitInfo.branch;

    	return `https://${location.hostname}/${owner}/${repo}/commits/${branch}?author=${user}`;
    },
	getUserProfileUrl(user){
    	return `https://${location.hostname}/${user}`;
	}
}

export default urlUtil;