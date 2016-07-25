//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AppReducer from '@src/store/appStore.js';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';
import ghApiUtil from '@src/util/apiUtil';
import CommitBox from '@src/component/commitBox';

const AppStore = createStore( AppReducer );

chrome.extension.sendMessage({}, (response) => {
    var sideBarContainer;

    function _init(){
        const urlParams = util.getUrlVars();
        const visibleFlags = dataUtil.getVisibleFlags();
        const gitInfo = dataUtil.getGitInfo();

        AppStore.dispatch({
            type: 'REFRESH',
            value : gitInfo
        })

        //empty if needed
        $('#side-bar-advanced-tool').remove();

        sideBarContainer = $('<div id="side-bar-advanced-tool" />')
            .appendTo('body')

        const titleContainer = $('<h3 id="side-bar-title ta-center" />')
            .appendTo(sideBarContainer)
            .text('Github Improved Toolbox')

        const searchBarContainer = $('<form id="side-bar-form-search" />')
            .appendTo(sideBarContainer)
            .on('submit', sidebarUtil.onSearchRepo)
            .toggle(visibleFlags.searchFile);

        const cmdContainer = $('<div id="side-bar-cmd-palette" />')
            .appendTo(sideBarContainer);

        const repoProfileContainer = $('<div id="side-bar-repo-info" />')
        	.appendTo(sideBarContainer);



        //whitespace diff
        $('<button id="cmd-search-file" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('Search File')
            .on('click', sidebarUtil.onGoToGetSearchUrl)
            .toggle(visibleFlags.searchFile)

        $('<button id="cmd-diff-whitespace-option" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text(urlParams.w !== '1' ? 'Whitespace Diff' : 'Non-Whitespace Diff')
            .on('click', urlParams.w !== '1' ? sidebarUtil.onGoToDiffNonWhitespaceUrl : sidebarUtil.onGoTogetDiffWithWhitespaceUrl)
            .toggle(visibleFlags.differ)


        $('<button id="cmd-diff-type" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text(urlParams.diff !== 'split' ? 'Split Diff' : 'Unified Diff')
            .on('click', urlParams.diff !== 'split' ? sidebarUtil.onGoToSplitDiffUrl : sidebarUtil.onGoToUnifieDiffUrl)
            .toggle(visibleFlags.differ)


        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR created by you')
            .on('click', sidebarUtil.onGoToOwnPRUrl);


        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR assigned to you')
            .on('click', sidebarUtil.onGoToAssignedPRUrl)


        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR mentioning you')
            .on('click', sidebarUtil.onGoToMentioningYouPRUrl)


        //search
        $('<input class="form-control" placeholder="Keyword" name="keyword" />')
            .appendTo(searchBarContainer)
        $('<select class="form-select" name="type" />')
            .appendTo(searchBarContainer)
            .append($('<option value="file" />').text('File Content'))
            .append($('<option value="path" />').text('Path Name'))
            .append($('<option value="file,path" />').text('File and Content'))


        $('<input class="form-control" placeholder="Language" name="language" list="search-language" />')
            .appendTo(searchBarContainer)

        // $('<input class="form-control" placeholder="Author" name="author" />')
        //     .appendTo(searchBarContainer)

        //auto comeplete
        const dataListSearchLanguages = $('<datalist id="search-language" />')
            .appendTo(searchBarContainer);
        dataUtil.getSupportedLanguages().map( (language) => {
            $('<option />').attr('value', language).appendTo(dataListSearchLanguages)
        });


        $('<button class="btn btn-sm btn-primary" type="submit" />')
            .appendTo(searchBarContainer)
            .text('Search')

        //repo info
        //populate the contributor
    	if(!!gitInfo.owner && !!gitInfo.repo){
    		repoProfileContainer.empty();

    		const repoInstance = ghApiUtil.getRepo(gitInfo.owner, gitInfo.repo);

    		//contributors
    		const repoContribContainer = $(`
				<div id="side-bar-contributor-container" class="panel panel-primary">
				  <div class="panel-heading">
				    <h4>Contributors</h4>
				  </div>
				  <div class="panel-body"></div>
				</div>
    			`)
    			.appendTo(repoProfileContainer)
    			.toggle(visibleFlags.contributor)
    			.find('.panel-body')
    			.hide();
	        repoInstance.getContributors().then(({data : contributors}) => {
	        	contributors.map( (contributor) => {
	        		const author = contributor.author;
	        		const totalContributions = contributor.total;
	        		const commitByAuthorUrl = urlUtil.getCommitByAuthorUrl( author.login );
	        		const userProfileUrl = urlUtil.getUserProfileUrl( author.login );

	        		// avatar_url
	        		$('<div class="flex-row" />')
	        			.append(`
	        				<div class="flex-grow1">
	        					<a href="${userProfileUrl}">${author.login}</a>
	        					<a class="margin-left0 tooltipped tooltipped-s" href="${commitByAuthorUrl}" aria-label="${author.login}'s commits">
	        						<svg aria-hidden="true" class="octicon octicon-history" heigithubApit="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M8 13H6V6h5v2H8v5zM7 1C4.81 1 2.87 2.02 1.59 3.59L0 2v4h4L2.5 4.5C3.55 3.17 5.17 2.3 7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-.34.03-.67.09-1H.08C.03 7.33 0 7.66 0 8c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"></path></svg>
        						</a>
        					</div>
    					`)
	        			.append(`<span class="flex-shrink0">${totalContributions}</span>`)
	        			.appendTo(repoContribContainer);
	        	});
	        });
    	}


		//commits box
		$('<div id="side-bar-commit-container" />')
			.appendTo(repoProfileContainer)

		ReactDOM.render(
            <Provider store={AppStore}>
                <CommitBox></CommitBox>
            </Provider>,
			document.getElementById('side-bar-commit-container')
		);



    	//event
    	$(document).on('click', '.panel-heading', function(){
    		$(this).closest('.panel').find('.panel-body').toggle();
    	})
    }

    function _eventLoopHandler(){
        const urlParams = util.getUrlVars();
        const visibleFlags = dataUtil.getVisibleFlags();

        sideBarContainer
            .find('#cmd-search-file')
            .off('click')
            .toggle(visibleFlags.searchFile)

        sideBarContainer
            .find('#cmd-diff-whitespace-option')
            .off('click')
            .text(urlParams.w !== '1' ? 'Whitespace Diff' : 'Non-Whitespace Diff')
            .on('click', urlParams.w !== '1' ? sidebarUtil.onGoToDiffNonWhitespaceUrl : sidebarUtil.onGoTogetDiffWithWhitespaceUrl)
            .toggle(visibleFlags.differ)

        sideBarContainer
            .find('#cmd-diff-type')
            .off('click')
            .text(urlParams.diff !== 'split' ? 'Split Diff' : 'Unified Diff')
            .on('click', urlParams.diff !== 'split' ? sidebarUtil.onGoToSplitDiffUrl : sidebarUtil.onGoToUnifieDiffUrl)
            .toggle(visibleFlags.differ)

        sideBarContainer
            .find('#side-bar-form-search')
            .toggle(visibleFlags.searchFile)
    }

    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            _init();

            // setInterval(_eventLoopHandler, 3000);

            //update self every 3 seconds
            setInterval( function(){
            	const gitInfo = dataUtil.getGitInfo();
            	const newState = {
            		owner: gitInfo.owner,
            		repo: gitInfo.repo,
            		branch: gitInfo.branch,
            		commit: gitInfo.commit,
            		file: gitInfo.file,
            		pull: gitInfo.pull,
                    commits: []
            	}

            	newState.repoInstance = (!!gitInfo.owner && !!gitInfo.repo) ? ghApiUtil.getRepo(gitInfo.owner, gitInfo.repo)
            		: null;


                const _dispatchRefresh = () => {
                    AppStore.dispatch({
                        type: 'REFRESH',
                        value : newState
                    });
                }

            	if(!!newState.repoInstance && typeof newState.repoInstance.listCommits === 'function'){
            		const listCommitPayload = {
            			// sha
            			// path
            			// author
            		};
            		//filter out by file name if needed
            		if(!!gitInfo.file){
            			listCommitPayload.path = newState.file.substr(newState.file.indexOf('/'));
            		}
            		newState.repoInstance.listCommits(listCommitPayload).then(({data : commits}) => {
            			newState.commits = commits;
                        _dispatchRefresh();
            		}, _dispatchRefresh)
            	} else {
            		//no owner and repo ready, just set up empty commits
                    _dispatchRefresh();
            	}
            }, 3000);
        }
    }, 10);
});
