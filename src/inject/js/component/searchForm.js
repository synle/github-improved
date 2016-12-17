//external
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


//internal
import dataUtil from '@src/util/dataUtil';
import sidebarUtil from '@src/util/sidebarUtil';
import Panel from '@src/component/panel';

//internal
const SearchForm = React.createClass({
  render() {
      const { owner, repo, visible } = this.props;

      if(visible && (!!owner && !!repo)){
          //auto complete
          const supportedLangOptions = dataUtil.getSupportedLanguages().map( (language) => {
              return (<option key={language} value={language}>{language}</option>);
          });

          const domHeader = 'Search';

          const domBody = (
            <div className="panel-body padding-top0">
              <form id="side-bar-form-search"
                onSubmit={sidebarUtil.onSearchRepo}>
                <input className="form-control" placeholder="Keyword" name="keyword" />
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
              </form>
            </div>
          );

          return (
            <Panel domHeader={domHeader}
              domBody={domBody}
              isExpanded={true}
              />
          );
      }

      return null;
  }
});


const mapStateToProps = function(state) {
  return {
      visible: _.get( state, 'ui.visible.searchBox'),
      owner : _.get( state, 'repo.owner'),
      repo : _.get( state, 'repo.repo')
  };
}

export default connect(mapStateToProps)(SearchForm);
