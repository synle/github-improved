import React from 'react';
import { connect } from 'react-redux';

//internal
import sidebarUtil from '@src/util/sidebarUtil';

const PRNavigation = React.createClass({
  render() {
      return (
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h4>Pull Request</h4>
              </div>
              <div className="panel-body" class="padding-top0">
                <div id="side-bar-pr-toolbox"></div>
                <div>
                    <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR created by you</button>
                    <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm">PR assigned to you</button>
                    <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR mentioning you</button>
                </div>
              </div>
          </div>
      );
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PRNavigation);
