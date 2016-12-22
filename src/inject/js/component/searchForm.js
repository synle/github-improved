//external
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


//internal
import dataUtil from '@src/util/dataUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import Panel from '@src/component/panel';


const BLACK_LIST_FILE_NAMES = [
  '.gitignore'
].reduce(
  (res, f) => {
    res[f] = 1;
    return res;
  },
  {}
);

var MAX_SEARCH_MATCHES = 15;

//internal
const SearchForm = React.createClass({
  getInitialState() {
    return {
      keyword: '',
      matchedSearches: [],
      matchingSearchTimer: false,
      supportedLangOptions : dataUtil.getSupportedLanguages().map(
        language => <option key={language} value={language}>{language}</option>
      )
    };
  },
  render() {
      const { owner, repo, visible, trees, fileNames } = this.props;
      const { keyword, matchedSearches, supportedLangOptions } = this.state;

      if(visible && (!!owner && !!repo)){
          //auto complete
          const fileNamesOptions = _.slice(matchedSearches, 0, MAX_SEARCH_MATCHES).map(
            fileName => <option key={fileName} value={fileName}>{fileName}</option>
          );

          const domHeader = 'Search';

          const domBody = (
            <form id="side-bar-form-search"
              className="margin-top0"
              onSubmit={sidebarUtil.onSearchRepo}>
              <input className="form-control"
                placeholder="Keyword"
                name="keyword"
                list="search-file-name"
                onChange={e => this.onChangeKeyword(e.target.value)}
                value={keyword} />
              <select className="form-select" name="type">
                <option value="file,path">File and Content</option>
                <option value="file">File Content</option>
                <option value="path">Path Name</option>
              </select>
              <input className="form-control" placeholder="Language" name="language" list="search-language" />
              <button className="btn btn-sm btn-primary" type="submit">
                Search
              </button>
              <datalist id="search-language">
                {supportedLangOptions}
              </datalist>
              <datalist id="search-file-name">
                {fileNamesOptions}
              </datalist>
            </form>
          );

          return (
            <Panel domHeader={domHeader}
              domBody={domBody}
              isExpanded={true}
              />
          );
      }

      return null;
  },
  onChangeKeyword(keyword){
    const matchingSearchTimer = setTimeout(
      () => {
        const curKeyword = (this.state.keyword || '').toLowerCase();
        const { fileNames } = this.props;
        const matchedSearches = curKeyword
          ? fileNames.filter(
            (fName) => fName.toLowerCase().indexOf(curKeyword) >= 0
          )
          : _.slice(fileNames, 0, MAX_SEARCH_MATCHES)

        this.setState({
          matchedSearches,
          matchingSearchTimer: null
        });
      },
      200
    );

    if(this.state.matchingSearchTimer){
      clearTimeout(this.state.matchingSearchTimer);
    }

    this.setState({
      matchingSearchTimer,
      keyword
    })
  }
});


const mapStateToProps = function(state) {
  const trees = _.get(state, 'repo.trees') || [];
  const fileNames = trees.reduce(
    (res, tree) => {
      const splits = tree.split('/')
        .filter(fn => !!fn)
        .map(fn => fn.replace(/\.\w+/, ''))
        .forEach(fn => {res[fn] = 1});

      return res;
    },
    {}//initial value
  );

  return {
      visible: _.get( state, 'ui.visible.searchBox'),
      trees : trees,
      fileNames: Object.keys(fileNames),
      owner : _.get( state, 'repo.owner'),
      repo : _.get( state, 'repo.repo')
  };
}

export default connect(mapStateToProps)(SearchForm);
