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

//internal
const SearchForm = React.createClass({
  getInitialState() {
    return {
      keyword: ''
    };
  },
  render() {
      const { owner, repo, visible, trees, fileNames } = this.props;
      const { keyword } = this.state;

      if(visible && (!!owner && !!repo)){
          //auto complete
          const supportedLangOptions = dataUtil.getSupportedLanguages().map(
            language => <option key={language} value={language}>{language}</option>
          );

          const matchedFileName = fileNames.filter((fName) => fName.indexOf(keyword) >= 0);

          const fileNamesOptions = _.slice(matchedFileName, 0, 50).map(
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
                onChange={this.onChangeKeyword}
                value={keyword} />
              <select className="form-select" name="type">
                <option value="file">File Content</option>
                <option value="path">Path Name</option>
                <option value="file,path">File and Content</option>
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
  onChangeKeyword(e){
    const newKeyword = e.target.value;
    this.setState({
      keyword: newKeyword
    });
  }
});


const mapStateToProps = function(state) {
  const trees = _.get(state, 'repo.trees') || [];
  const fileNames = trees.reduce(
    (res, tree) => {
      const splits = tree.split('/')
        .map(t => t.toLowerCase())
        .forEach(t => {
          res[t] = 1;
        });

      const lastSegment = _.last(splits);
      if(!BLACK_LIST_FILE_NAMES[lastSegment]){
        res[lastSegment] = 1;
      }

      return res;
    },
    {}//initial value
  );

  return {
      visible: _.get( state, 'ui.visible.searchBox'),
      trees : trees,
      fileNames: fileNames,
      owner : _.get( state, 'repo.owner'),
      repo : _.get( state, 'repo.repo')
  };
}

export default connect(mapStateToProps)(SearchForm);
