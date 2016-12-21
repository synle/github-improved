//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';

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

    sideBarContainer = $('<div id="side-bar-body" class="noselect" />')
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
      var resizer = document.createElement('div');
      resizer.className = 'resizer';
      resizer.addEventListener('mousedown', initDrag, false);

      containerDom.classList.add('resizable');
      containerDom.parentNode.appendChild(resizer);

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
        var newWidth = getNewWidth(e);
        containerDom.style.width =  newWidth;

        //move the resizer
        resizer.style.left = newWidth;

        //adjust the offset for container
        $('.container-lg, .page-content, .container').css({
          'margin-left' :  `${newWidth} !important`
        });
      }

      function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      }

      function getNewWidth(e){
        var newWidth = Math.min((startWidth + e.clientX - startX), 450);
        newWidth = Math.max(300, newWidth);

        return newWidth + 'px';
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
      const pjaxContainer = document.querySelectorAll('#js-repo-pjax-container, .context-loader-container, [data-pjax-container]')[0];
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
