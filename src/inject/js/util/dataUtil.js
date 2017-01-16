import _ from 'lodash';

// internal
import restUtil from '@src/util/restUtil';
import {ChromeStoragePersistentData} from '@src/util/persistentStorage';
// import {LocalStoragePersistentData} from '@src/util/persistentStorage';

const dataUtil = {
  getUrlSplits() {
    const pathName = location.pathname;
    return pathName.split('/').filter(url => !!url);
  },
  getGitInfo() {
    const pathName = location.pathname;
    const urlSplits = pathName.split('/').filter(url => !!url);
    const owner = $('.repohead-details-container [itemprop="author"]').text();
    const repo = $('.repohead-details-container [itemprop="name"]').text();


    //get commit sha
    var commit = $('.sha.user-select-contain').text();
    if(!commit && (pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0)) {
      commit = urlSplits[urlSplits.length - 1];
    }



    //get current file path
    var file = _.trim($('.file-navigation .breadcrumb').text());
    var path = !!file ? file.substr( file.indexOf('/') + 1 ) : null ||
      '';
    path = _.trimEnd(path, '/');

    var pull;
    if(pathName.indexOf('/pull/') >= 0 && pathName.indexOf('/files') >= 0) {
      pull = urlSplits[urlSplits.length - 2];
    }


    // is pull request details
    let splitPrNumber = pathName.match(/\/pull\/\d+/);
    let isPullRequestPage = !!splitPrNumber;
    let pullRequestNumber;
    if(isPullRequestPage) {
      // TODO: null check here
      pullRequestNumber = splitPrNumber[0].split('/')[2];
    }


    let splitCompareBranch = pathName.match(/\/compare\/\w+/);
    let isCompareMode = !!splitCompareBranch;
    if(isCompareMode) {
      isPullRequestPage = true;
    }



    //get branch
    // var branch = $$('.branch-select-menu .select-menu-button').attr('title');
    let branchDom1 = $('[aria-label="Switch branches or tags"]').first();
    let branchDom2 = $('.commit-branches a').first();
    let branchDom3 = $('.current-branch.head-ref').first();
    let branch = '';
    if(isPullRequestPage){
      branch = branchDom3.text();
    } else if(branchDom1.length > 0) {
      branch = branchDom1.attr('title');
    } else if(branchDom2.length > 0) {
      branch = branchDom2.text();
    } else if(urlSplits.length >= 2) {
      const relavantUrlSplits = urlSplits.filter(url => ['pulls', 'tree', owner, repo].indexOf(url) === -1);
      branch = _.get(relavantUrlSplits, '0') || '';
    }
    branch = _.trim(branch);

    return {
      owner,
      repo,
      branch,
      commit,
      file,
      pull,
      path,
      isPullRequestPage,
      pullRequestNumber,
      isCompareMode
    };
  },
  getSupportedLanguages() {
    return [
      'css',
      'scss',
      'html',
      'js',
      'json',
      'xml',
      'java'
    ]
  },
  getPersistedProp: ChromeStoragePersistentData.getPersistedProp,
  setPersistedProp: ChromeStoragePersistentData.setPersistedProp,
  clearPersistedProp(key) {  return ChromeStoragePersistentData.clearPersistedProp(key);  },
  getInitialFromName(longString) {
    longString = longString || '';

    let ret = _.slice(
      longString
        .split(' ')
        .map(s => s[0])
        .join(''),
      0,
      2
    ).join('');

    if(ret.length === 1) {
      ret = longString.substr(0,2);
    }

    return _.upperCase(ret);
  },
  // github api...
  // https://developer.github.com/v3/
  fetchUserProfile() {
    return restUtil.get(`https://api.github.com/user`);
  },
  fetchContributorList(owner, repo) {
    return owner && repo
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`)
      : Promise.reject();
  },
  fetchPullRequests(owner, repo) {
    return owner && repo
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls`)
      : Promise.reject();
  },
  fetchCommitListByPrDetails(owner, repo, pullRequestNumber) {
    return owner && repo && pullRequestNumber
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/commits`)
      : Promise.reject();
  },
  fetchCommitListBySha(owner, repo, path) {
    if(owner && repo) {
      return path
        ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`)
        : restUtil.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
    }
    return Promise.reject();
  },
  fetchTreeList(owner, repo, commit) {
    return owner && repo && commit
      ? restUtil.get(
        `https://github.com/${owner}/${repo}/tree-list/${commit}`,
        null,//data
        {//config
          'Accept': 'application/json'
        }
      )
      : Promise.reject();
  },
  fetchExplorerFileListBySha(owner, repo, branch, commit) {
    const shaRef = commit || branch || 'master';// if not worst case, fall back to master

    return owner && repo && shaRef
      ? restUtil.get(
        `https://github.com/${owner}/${repo}/tree-list/${shaRef}`,
        null,//data
        {//config
          'Accept': 'application/json'
        }
      )
      : Promise.reject();
  },
  fetchExplorerFileListByPrDetails(owner, repo, pullRequestNumber) {
    return owner && repo && pullRequestNumber
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/files`)
      : Promise.reject();
  },
  fetchPjaxCall(url) {
    return restUtil.pjax(
      url
    );
  }
}

export default dataUtil;
