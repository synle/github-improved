import urlUtil from './urlUtil';

var sideBarTool = {
	onGoToSplitDiffUrl: function(){
		location.href = urlUtil.getSplitDiffUrl();
	},
	onGoToUnifieDiffUrl: function(){
		location.href = urlUtil.getUnifiedDiffUrl();
	},
    onGoToDiffNonWhitespaceUrl: function() {
        location.href = urlUtil.getDiffNonWhitespaceUrl();
    },
    onGoTogetDiffWithWhitespaceUrl: function() {
        location.href = urlUtil.getDiffWithWhitespaceUrl();
    },
    onGoToGetSearchUrl : function(){
    	location.href = urlUtil.getSearchUrl();
    },
    onGoToOwnPRUrl : function(){
    	location.href = urlUtil.getOwnPRUrl();
    },
    onGoToAssignedPRUrl : function(){
    	location.href = urlUtil.getAssignedPRUrl();
    },
    onGoToMentioningYouPRUrl: function () {
    	location.href = urlUtil.getMentioningPRUrl();
    },
    onSearchRepo: function() {
    	var formSearch = $('#side-bar-form-search') ; //$(this)
    	var formSearchData = formSearch.serializeArray().reduce(
    		(res, formData) => {
    			if(!!formData.value){
    				res[formData.name] = formData.value;
    			}
    			return res;
    		}
			,{}
		);

    	location.href = urlUtil.getRepoSearchResultUrl(
    		formSearchData.keyword,
    		formSearchData.language,
    		formSearchData.type,//in:file or in:path or in:file,path
    		formSearchData.author
		);

		return false;
    }
}

export default sideBarTool;