import urlUtil from '@src/util/urlUtil';

var sideBarTool = {
	onGoToSplitDiffUrl() {
		location.href = urlUtil.getSplitDiffUrl();
	},
	onGoToUnifieDiffUrl() {
		location.href = urlUtil.getUnifiedDiffUrl();
	},
    onGoToDiffWhitespaceOffUrl () {
        location.href = urlUtil.getDiffNonWhitespaceUrl();
    },
    onGoToDiffWhitespaceOnUrl () {
        location.href = urlUtil.getDiffWithWhitespaceUrl();
    },
    onGoToGetSearchUrl() {
    	location.href = urlUtil.getSearchUrl();
    },
    onGoToOwnPRUrl() {
    	location.href = urlUtil.getOwnPRUrl();
    },
    onGoToAssignedPRUrl() {
    	location.href = urlUtil.getAssignedPRUrl();
    },
    onGoToMentioningYouPRUrl() {
    	location.href = urlUtil.getMentioningPRUrl();
    },
    onSearchRepo() {
    	const formSearch = $('#side-bar-form-search') ; //$(this)
    	const formSearchData = formSearch.serializeArray().reduce(
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
