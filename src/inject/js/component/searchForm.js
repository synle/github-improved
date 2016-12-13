//external
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


//internal
import dataUtil from '@src/util/dataUtil';
import sidebarUtil from '@src/util/sidebarUtil';

//internal
const SearchForm = React.createClass({
  render() {
      if(!!this.props.owner && !!this.props.repo){
          //auto complete
          const supportedLangOptions = dataUtil.getSupportedLanguages().map( (language) => {
              return (<option key={language} value={language}>{language}</option>);
          });

          return (
            <form id="side-bar-form-search"
              className="panel panel-primary"
              onSubmit={sidebarUtil.onSearchRepo}>
                <div className="panel-heading">
                  <h4>Search</h4>
                </div>
                <div className="panel-body padding-top0">
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
                </div>
            </form>
          );
      }

      return null;
  }
});


const mapStateToProps = function(state) {
  return {
      owner : _.get( state, 'repo.owner'),
      repo : _.get( state, 'repo.repo')
  };
}

export default connect(mapStateToProps)(SearchForm);
