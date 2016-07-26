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
import DiffOptionBox from '@src/component/diffOptionBox';
import PrNavigation from '@src/component/prNavigation';
import BtnQuickSearchFile from '@src/component/btnQuickSearchFile';
import SearchForm from '@src/component/searchForm';

//create the store
const AppStore = createStore( AppReducer );

chrome.extension.sendMessage({}, (response) => {
    var sideBarContainer;

    function _init(){
        //empty if needed
        $('#side-bar-advanced-tool').remove();

        sideBarContainer = $('<div id="side-bar-advanced-tool" />')
            .appendTo('body')
            .html(`
            	<h3 id="side-bar-title ta-center">Github Improved Toolbox</h3>
				<div id="side-bar-body"></div>
        	`);


        //render the app
        ReactDOM.render(
            <Provider store={AppStore}>
            	<div>
            		<BtnQuickSearchFile></BtnQuickSearchFile>
	            	<SearchForm></SearchForm>
	            	<DiffOptionBox></DiffOptionBox>
	            	<PrNavigation></PrNavigation>
	                <ContributorBox></ContributorBox>
	                <CommitBox></CommitBox>
            	</div>
            </Provider>,
            $('#side-bar-body')[0]
		);

    	//event
    	$(document).on('click', '.panel-heading', function(){
    		$(this).closest('.panel').find('.panel-body').toggle();
    	});
    }

    function _refreshState(){
        const urlParams = util.getUrlVars();
        const gitInfo = dataUtil.getGitInfo();
        const newState = {
            urlParams : urlParams,
            owner: gitInfo.owner,
            repo: gitInfo.repo,
            branch: gitInfo.branch,
            commit: gitInfo.commit,
            file: gitInfo.file,
            pull: gitInfo.pull,
            commits: [],
            contributors: [],
            visible : {
            	contributor: location.href.match(/\//g).length === 4
            }
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
            //limit things to 50
            newState.contributors = newState.contributors.reverse().slice(0, 50);
            newState.commits = newState.commits.slice(0, 50);
            AppStore.dispatch({
                type: 'REFRESH',
                value : newState
            });
        });
    }

    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            _init();
            _refreshState();//trigger the first state change

			//adapted from octotree for changes in the dom
			//reload the state
		    const pjaxContainer = $('#js-repo-pjax-container, .context-loader-container, [data-pjax-container]')[0];
		    if (!!pjaxContainer){
		    	const pageChangeObserver = new window.MutationObserver(() => {
					_refreshState();
			    })
		    	pageChangeObserver.observe(pjaxContainer, {
					childList: true
				});
		    }
        }
    }, 10);
});
