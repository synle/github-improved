//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Q from 'q';

//reducer
import AppReducer from '@src/store/appStore.js';
import APIReducer from '@src/store/apiStore.js';

//action
import APP_ACTION from '@src/store/appAction.js';

//internal
import dataUtil from '@src/util/dataUtil';
import urlUtil from '@src/util/urlUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import util from '@src/util/globalUtil';

//component
import CommitBox from '@src/component/commitBox';
import ContributorBox from '@src/component/contributorBox';
import DiffOptionBox from '@src/component/diffOptionBox';
import PrNavigation from '@src/component/prNavigation';
import BtnQuickSearchFile from '@src/component/btnQuickSearchFile';
import SearchForm from '@src/component/searchForm';
import FileExplorer from '@src/component/fileExplorer';
import TokenRequestForm from '@src/component/tokenRequestForm';

//create the store
const AppStore = createStore( AppReducer );
const APIStore = createStore( APIReducer );

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
            <div>
                <Provider store={AppStore}>
                    <div>
                        <BtnQuickSearchFile></BtnQuickSearchFile>
                        <SearchForm></SearchForm>
                        <DiffOptionBox></DiffOptionBox>
                        <PrNavigation></PrNavigation>
                        <FileExplorer></FileExplorer>
                        <ContributorBox></ContributorBox>
                        <CommitBox></CommitBox>
                    </div>
                </Provider>
                <Provider store={APIStore}>
                    <TokenRequestForm></TokenRequestForm>
                </Provider>
            </div>,
            $('#side-bar-body')[0]
		);

    	//event
    	$(document).on('click', '.panel-heading', function(){
    		$(this).closest('.panel').find('.panel-body').toggle();
    	});
    }

    function _refreshState(){
        const countSlashInUrl =  location.href.match(/\//g).length;
        const urlParams = util.getUrlVars();
        const gitInfo = dataUtil.getGitInfo();
        const newState = {
            urlParams : urlParams,
            owner: gitInfo.owner,
            repo: gitInfo.repo,
            branch: gitInfo.branch,
            commit: gitInfo.commit,
            file: gitInfo.file,
            path: gitInfo.path,
            pull: gitInfo.pull,
            commits: null,
            contributors: null,
            trees: null,
            visible : {
            	contributor: countSlashInUrl === 4,
                fileExplorer: countSlashInUrl >= 3,
                commit : countSlashInUrl > 3
            }
        }

        newState.repoInstance = (!!gitInfo.owner && !!gitInfo.repo && !!APIStore.getState().apiInstance)
            ? APIStore.getState().apiInstance.getRepo(gitInfo.owner, gitInfo.repo)
            : null;


        const deferredCommits = Q.defer();
        const deferredContribs = Q.defer();
        const deferredTrees = Q.defer();

        if(!!newState.repoInstance){
            //fetch commits
            const listCommitPayload = {
                // sha
                // path
                // author
            };
            //filter out by file name if needed
            if(!!newState.path){
                listCommitPayload.path = newState.path;
            }
            newState.repoInstance.listCommits(listCommitPayload).then(({data : commits}) => {
                deferredCommits.resolve( newState.commits = commits );
            }, deferredCommits.resolve);




            //fetch contributors
            newState.repoInstance.getContributors().then(({data : contributors}) => {
                deferredContribs.resolve( newState.contributors = contributors );
            }, deferredContribs.resolve);



            //fetch trees
            //filter out by file name if needed
            // if(!!newState.path){
            //     listCommitPayload.path = newState.path;
            // }
            newState.repoInstance.getTree( newState.branch ).then(({data : trees}) => {
                deferredTrees.resolve( newState.trees = trees);
            }, deferredTrees.resolve);
        } else {
            //no owner and repo ready, just set up empty commits
            deferredCommits.resolve();
            deferredContribs.resolve();
            deferredTrees.resolve();
        }



        //when everything is done, let's refresh the ui
        Q.allSettled([
            deferredCommits.promise,
            deferredContribs.promise,
            deferredTrees.promise
        ]).then( function(){
            //limit things to 50
            newState.contributors = newState.contributors.reverse().slice(0, 50);
            newState.commits = newState.commits.slice(0, 50);
            AppStore.dispatch(
                APP_ACTION.refresh(newState)
            );
        });

        //move the stuff
        $('#side-bar-pr-toolbox').empty();
        setTimeout(() => {
            $('.discussion-sidebar').appendTo('#side-bar-pr-toolbox');
        }, 2000)
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
