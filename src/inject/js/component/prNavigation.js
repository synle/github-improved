import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';

const PRNavigation = React.createClass({
  render() {
      const { visible } = this.props;

      if(visible){
        return (
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h4>Pull Request</h4>
              </div>
              <div className="panel-body padding-top0">
                <div id="side-bar-pr-toolbox"></div>
                <div>
                    <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR created by you</button>
                    <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm">PR assigned to you</button>
                    <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR mentioning you</button>
                </div>
              </div>
          </div>
        );
      } else {
        return null;
      }
  }
});


const mapStateToProps = function(state) {
  return {
    visible: _.get( state, 'ui.visible.prNavBox')
  };
}

export default connect(mapStateToProps)(PRNavigation);
