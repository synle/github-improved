import React from 'react';
import { connect } from 'react-redux';
import sidebarUtil from '@src/util/sidebarUtil';
import _ from 'lodash';

import dataUtil from '@src/util/dataUtil';

//internal
const SearchForm = React.createClass({
  render() {
      if(!!this.props.owner && !!this.props.repo){
          //auto complete
          const supportedLangOptions = dataUtil.getSupportedLanguages().map( (language) => {
              return (<option key={language} value={language}>{language}</option>);
          });

          return (
            <form id="side-bar-form-search">
                <input className="form-control" placeholder="Keyword" name="keyword" />
                <select className="form-select" name="type">
                    <option value="file">File Content</option>
                    <option value="path">Path Name</option>
                    <option value="file,path">File and Content</option>
                </select>
                <input className="form-control" placeholder="Language" name="language" list="search-language" />
                <button class="btn btn-sm btn-primary" type="submit" />
                <datalist id="search-language">
                    {supportedLangOptions}
                </datalist>
            </form>
          );
      }

      return null;
  }
});


const mapStateToProps = function(state) {
  return {
      owner : _.get( state, 'owner'),
      repo : _.get( state, 'repo')
  };
}

export default connect(mapStateToProps)(SearchForm);
