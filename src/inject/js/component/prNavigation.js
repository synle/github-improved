import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';
import Panel from '@src/component/panel';
import Pagination from '@src/component/pagination';

const PAGE_SIZE_PULL_REQUEST = 5;

const PRNavigation = React.createClass({
  render() {
      const { visible, pullRequests } = this.props;

      if(visible){
        const domHeader = 'Pull Request';
        const domPullRequestList = pullRequests.map(
          pr => {
            const domKey = `pr-${pr.id}`;

            return (
              <div key={domKey} className="small-text border-bottom">
                <a href={pr.url}>{pr.title}</a>
              </div>
            );
          }
        );
        const domBody = (
          <div>
            <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">PR created by you</button>
            <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm margin-top0">PR assigned to you</button>
            <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm margin-top0">PR mentioning you</button>

            <Pagination domList={domPullRequestList} pageSize={PAGE_SIZE_PULL_REQUEST}></Pagination>
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
    visible: _.get( state, 'ui.visible.prNavBox'),
    pullRequests: _.get( state, 'repo.pullRequests') || [],
  };
}

export default connect(mapStateToProps)(PRNavigation);
