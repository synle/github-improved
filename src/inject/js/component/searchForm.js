import React from 'react';
import { connect } from 'react-redux';
import sidebarUtil from '@src/util/sidebarUtil';
import _ from 'lodash';

//internal
const PRNavigation = React.createClass({
  render() {
      if(!!this.props.owner && !!this.props.repo){
          return (
            <form id="side-bar-form-search">
                <input class="form-control" placeholder="Keyword" name="keyword" />
                <select class="form-select" name="type">
                    <option value="file">File Content</option>
                    <option value="path">Path Name</option>
                    <option value="file,path">File and Content</option>
                </select>
            </form>
          );
      }

      return null;


      $('<input class="form-control" placeholder="Language" name="language" list="search-language" />')
          .appendTo(searchBarContainer)

      //auto comeplete
      const dataListSearchLanguages = $('<datalist id="search-language" />')
          .appendTo(searchBarContainer);
      dataUtil.getSupportedLanguages().map( (language) => {
          $('<option />').attr('value', language).appendTo(dataListSearchLanguages)
      });


      $('<button class="btn btn-sm btn-primary" type="submit" />')
          .appendTo(searchBarContainer)
          .text('Search')
  }
});


const mapStateToProps = function(state) {
  return {
      owner : _.get( state, 'owner'),
      repo : _.get( state, 'repo')
  };
}

export default connect(mapStateToProps)(PRNavigation);
