import _ from 'lodash';

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
    if(branchDom1.length > 0){
      branch = branchDom1.text();
    } else if(branchDom2.length > 0){
      branch = branchDom2.text();
    } else {
      if(urlSplits.length >= 2){
        const relavantUrlSplits = urlSplits.filter(url => ['tree', owner, repo].indexOf(url) === -1);
        branch = _.get(relavantUrlSplits, '0') || '';
      }
    }
    branch = _.trim(branch);


    var commit = $('.sha.user-select-contain').text();
    if(!commit && (pathName.indexOf('/commit/') >= 0 || pathName.indexOf('/commits/') >= 0)){
      commit = urlSplits[urlSplits.length - 1];
    }

    var file = _.trim($('.file-navigation .breadcrumb').text());
    var path = !!file ? file.substr( file.indexOf('/') ) : null ||
      '';

    var pull;
    if(pathName.indexOf('/pull/') >= 0 && pathName.indexOf('/files') >= 0){
      pull = urlSplits[urlSplits.length - 2];
    }


    return {
      owner, repo, branch, commit, file, pull, path
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
  getPersistedProp(key){
    return localStorage[`github-improved.${key}`]
  },
  setPersistedProp(key, value){
    localStorage[`github-improved.${key}`] = value;
    return localStorage[`github-improved.${key}`];
  },
  clearPersistedProp(key){
    localStorage[`github-improved.${key}`] = null;
  }
}

export default dataUtil;
