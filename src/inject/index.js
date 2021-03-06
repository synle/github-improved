//external
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';

//reducer
import AppStore from '@src/store/appStore.js';

//action
import AppAction from '@src/store/appAction';

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
import SearchForm from '@src/component/searchForm';
import FileExplorer from '@src/component/fileExplorer';
import TokenRequestForm from '@src/component/tokenRequestForm';
import PageHeader from '@src/component/pageHeader';

chrome.extension.sendMessage({}, (response) => {
  let sideBarContainer;

  function _init(){
    //empty if needed
    $('#side-bar-body').remove();

    sideBarContainer = $('<div id="side-bar-body" class="transition-ease noselect" />')
      .appendTo('body');


    //render the app
    ReactDOM.render(
      <Provider store={AppStore}>
        <div>
          <PageHeader></PageHeader>
          <div id="side-bar-body-content" className="margin-top0">
            <SearchForm></SearchForm>
            <DiffOptionBox></DiffOptionBox>
            <PrNavigation></PrNavigation>
            <FileExplorer></FileExplorer>
            <ContributorBox></ContributorBox>
            <CommitBox></CommitBox>
            <TokenRequestForm></TokenRequestForm>
          </div>
        </div>
      </Provider>,
      document.querySelector('#side-bar-body')
    );


    //handling resize
    (function(containerDom){
      // init
      let startX, startWidth, sideBarWidth;
      const resizer = document.createElement('div');
      resizer.className = 'resizer';
      resizer.addEventListener('mousedown', initDrag, false);

      containerDom.classList.add('resizable');
      containerDom.appendChild(resizer);
      //end init

      function doDrag(e) {
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
      }

      function initDrag(e) {
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(containerDom).width, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);

        resizer.classList.add('resizing');
      }

      function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);

        // doing the resize
        sideBarWidth = getNewWidth(e);
        doResize(sideBarWidth);
        // remove the resizing class
        resizer.classList.remove('resizing');
        dataUtil.setPersistedProp('side-bar-width', sideBarWidth)
          .then(
            () => {

            }
          );
      }


      function doResize(newWidth){
        // update the side bar width
        util.setSideBarWidth(newWidth);
      }

      function getNewWidth(e){
        // let newWidth = startWidth + (e.clientX - startX) * -1; // left sidebar
        let newWidth = startWidth + (e.clientX - startX) * -1; // right sidebar

        // limit the max width to 500
        newWidth = Math.min(newWidth, 500);

        // limit the min width to 240
        newWidth = Math.max(240, newWidth);

        return newWidth + 'px';
      }
    })(sideBarContainer[0]);
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

      $(document).on('pjax:end', () => {
        _refreshState();
      })
    }
  }, 10);
});
