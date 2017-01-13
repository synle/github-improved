import _ from 'lodash';

// internal
import restUtil from '@src/util/restUtil';

const LocalStoragePersistentData = {
  getPersistedProp(key){
    return new Promise((resolve, reject) => {
      var ret = localStorage[`github-improved.${key}`];
      switch(ret){
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return ret;
      }
      resolve(ret);
    });
  },
  setPersistedProp(key, value){
    return new Promise((resolve, reject) => {
      localStorage[`github-improved.${key}`] = value;
      resolve(value);
    });
  },
  clearPersistedProp(key){
    return new Promise((resolve, reject) => {
      localStorage[`github-improved.${key}`] = null;
      resolve();
    });
  },
}


const ChromeStoragePersistentData = {
  getPersistedProp(key){
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  setPersistedProp(key, value){
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  clearPersistedProp(key){
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
}

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

    // var branch = $$('.branch-select-menu .select-menu-button').attr('title');
    // if(!branch){
    //  branch = 'master';
    // }

    //get branch
    let branchDom1 = $('[aria-label="Switch branches or tags"] span').first();
    let branchDom2 = $('.commit-branches a').first();
    let branch = '';
    if(urlSplits.length >= 2){
      const relavantUrlSplits = urlSplits.filter(url => ['pulls', 'tree', owner, repo].indexOf(url) === -1);
      branch = _.get(relavantUrlSplits, '0') || '';
    } else if(branchDom1.length > 0){
      branch = branchDom1.text();
    } else if(branchDom2.length > 0){
      branch = branchDom2.text();
    }
    branch = _.trim(branch);


    var commit = $('.sha.user-select-contain').text();
    if(!commit && (pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0)){
      commit = urlSplits[urlSplits.length - 1];
    }

    var file = _.trim($('.file-navigation .breadcrumb').text());
    var path = !!file ? file.substr( file.indexOf('/') + 1 ) : null ||
      '';
    path = _.trimEnd(path, '/');

    var pull;
    if(pathName.indexOf('/pull/') >= 0 && pathName.indexOf('/files') >= 0){
      pull = urlSplits[urlSplits.length - 2];
    }


    // is pull request details
    let splitPrNumber = pathName.match(/\/pull\/\d+/);
    let isPullRequestPage = !!splitPrNumber;
    let pullRequestNumber;
    if(isPullRequestPage){
      // TODO: null check here
      pullRequestNumber = splitPrNumber[0].split('/')[2];
    }


    let splitCompareBranch = pathName.match(/\/compare\/\w+/);
    let isCompareMode = !!splitCompareBranch;
    if(isCompareMode){
      isPullRequestPage = true;
    }

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
  getPersistedProp: LocalStoragePersistentData.getPersistedProp,
  setPersistedProp: LocalStoragePersistentData.setPersistedProp,
  clearPersistedProp: LocalStoragePersistentData.clearPersistedProp,
  getInitialFromName(longString){
    longString = longString || '';

    let ret = _.slice(
      longString
        .split(' ')
        .map(s => s[0])
        .join(''),
      0,
      2
    ).join('');

    if(ret.length === 1){
      ret = longString.substr(0,2);
    }

    return _.upperCase(ret);
  },
  // github api...
  // https://developer.github.com/v3/
  fetchUserProfile(){
    return restUtil.get(`https://api.github.com/user`);
  },
  fetchContributorList(owner, repo){
    return owner && repo
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`)
      : Promise.reject();
  },
  fetchPullRequests(owner, repo){
    return owner && repo
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls`)
      : Promise.reject();
  },
  fetchCommitListByPrDetails(owner, repo, pullRequestNumber){
    return owner && repo && pullRequestNumber
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/commits`)
      : Promise.reject();
  },
  fetchCommitListBySha(owner, repo, path){
    if(owner && repo){
      return path
        ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`)
        : restUtil.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
    }
    return Promise.reject();
  },
  fetchTreeList(owner, repo, commit){
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
  fetchExplorerFileListBySha(owner, repo, commit){
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
  fetchExplorerFileListByPrDetails(owner, repo, pullRequestNumber){
    return owner && repo && pullRequestNumber
      ? restUtil.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/files`)
      : Promise.reject();
  },
  fetchPjaxCall(url){
    return restUtil.pjax(
      url
    );
  }
}

export default dataUtil;
