//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Q from 'q';

//reducer
import AppReducer from '@src/store/appStore.js';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';
import ghApiUtil from '@src/util/apiUtil';

//component
import CommitBox from '@src/component/commitBox';
import ContributorBox from '@src/component/contributorBox';


//create the store
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


        //contributor box
        ReactDOM.render(
            <Provider store={AppStore}>
                <ContributorBox></ContributorBox>
            </Provider>,
            $('<div id="side-bar-contributor-box" />')
    			.appendTo(repoProfileContainer)[0]
		);


		//commits box
		ReactDOM.render(
            <Provider store={AppStore}>
                <CommitBox></CommitBox>
            </Provider>,
            $('<div id="side-bar-commit-box" />')
    			.appendTo(repoProfileContainer)[0]
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
                    commits: [],
                    contributors: []
            	}

            	newState.repoInstance = (!!gitInfo.owner && !!gitInfo.repo) ? ghApiUtil.getRepo(gitInfo.owner, gitInfo.repo)
            		: null;


                const deferredCommits = Q.defer();
                const deferredContribs = Q.defer();

                //list commits defer
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
                        deferredCommits.resolve();
            		}, deferredCommits.resolve);
            	} else {
            		//no owner and repo ready, just set up empty commits
                    deferredCommits.resolve();
            	}


                //list contrib
            	if(!!newState.repoInstance && typeof newState.repoInstance.getContributors === 'function'){
            		newState.repoInstance.getContributors().then(({data : contributors}) => {
            			newState.contributors = contributors;
                        deferredContribs.resolve();
            		}, deferredContribs.resolve);
            	} else {
            		//no owner and repo ready, just set up empty commits
                    deferredContribs.resolve();
            	}


                //when everything is done, let's refresh the ui
                Q.allSettled([
                    deferredCommits.promise,
                    deferredContribs.promise
                ]).then( function(){
                    AppStore.dispatch({
                        type: 'REFRESH',
                        value : newState
                    });
                });
            }, 3000);
        }
    }, 10);
});
