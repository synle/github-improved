import React from 'react';
import { connect } from 'react-redux';
import sidebarUtil from '@src/util/sidebarUtil';

//internal
const PRNavigation = React.createClass({
  render() {
      return <div>
        <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR created by you</button>
        <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm">PR assigned to you</button>
        <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR mentioning you</button>
      </div>;
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PRNavigation);
