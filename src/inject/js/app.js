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


    //handling resize
    (function(containerDom){
      containerDom.classList.add('resizable');
      var resizer = document.createElement('div');
      resizer.className = 'resizer';
      containerDom.appendChild(resizer);
      resizer.addEventListener('mousedown', initDrag, false);

      var startX, startY, startWidth, startHeight;

      function initDrag(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(containerDom).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(containerDom).height, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
      }

      function doDrag(e) {
        containerDom.style.width = (startWidth + e.clientX - startX) + 'px';
      }

      function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      }
    })(document.querySelector('#side-bar-body'));
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
      pullRequestNumber: gitInfo.pullRequestNumber,
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
