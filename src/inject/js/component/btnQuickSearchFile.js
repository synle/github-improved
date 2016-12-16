import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';

const CommitBox = React.createClass({
  render: function() {
      if(!!this.props.owner && !!this.props.repo){
          return (
            <button onClick={sidebarUtil.onGoToGetSearchUrl} className="btn btn-sm">
                Quick File Search
            </button>
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

export default connect(mapStateToProps)(CommitBox);
