import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';
import Panel from '@src/component/panel';

const PRNavigation = React.createClass({
  render() {
      const { visible } = this.props;

      if(visible){
        const domHeader = 'Pull Request';
        const domBody = (
          <div>
            <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR created by you</button>
            <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm">PR assigned to you</button>
            <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR mentioning you</button>
          </div>
        );
        return (
          <Panel domHeader={domHeader}
            domBody={domBody}
            isExpanded={true}
            />
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
