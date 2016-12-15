//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

//reducer
import AppStore from '@src/store/appStore.js';

//action
import AppAction from '@src/store/appAction.js';

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
import PageHeader from '@src/component/pageHeader';

chrome.extension.sendMessage({}, (response) => {
  var sideBarContainer;

  function _init(){
    //empty if needed
    $('#side-bar-body').remove();

    sideBarContainer = $('<div id="side-bar-body" />')
      .appendTo('body');


    //render the app
    ReactDOM.render(
      <Provider store={AppStore}>
        <div>
          <PageHeader></PageHeader>
          <BtnQuickSearchFile></BtnQuickSearchFile>
          <SearchForm></SearchForm>
          <DiffOptionBox></DiffOptionBox>
          <PrNavigation></PrNavigation>
          <FileExplorer></FileExplorer>
          <ContributorBox></ContributorBox>
          <CommitBox></CommitBox>
          <TokenRequestForm></TokenRequestForm>
        </div>
      </Provider>,
      document.querySelector('#side-bar-body')
    );

    //event
    $(document).on('click', '.panel-heading', function(){
     $(this).closest('.panel').find('.panel-body').toggle();
    });
  }

  function _refreshState(){
    const countSlashInUrl =  location.href.match(/\//g).length;
    const gitInfo = dataUtil.getGitInfo();
    const newState = {
      urlParams : util.getUrlVars(),
      owner: gitInfo.owner,
      repo: gitInfo.repo,
      branch: gitInfo.branch,
      commit: gitInfo.commit,
      file: gitInfo.file,
      path: gitInfo.path,
      pull: gitInfo.pull,
      isPullRequestPage: gitInfo.isPullRequestPage,
      commits: null,
      contributors: null,
      trees: null
    };

    //initialization
    AppStore.dispatch(
      AppAction.init(newState)
    );
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
