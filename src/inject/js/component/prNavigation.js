import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import dataUtil from '@src/util/dataUtil';
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
            const authorName = _.get(pr, 'user.login') || '';
            const shortAuthorName = dataUtil.getInitialFromName(authorName);

            return (
              <div key={domKey} className="small-text border-top">
                <strong className="margin-right0 tooltipped tooltipped-ne"
                  aria-label={authorName}>
                  {shortAuthorName}
                </strong>
                <a href={pr.html_url}>{pr.title}</a>
              </div>
            );
          }
        );
        const domBody = (
          <div>
            <div className="flex-row justify-content-space-between padding-bottom0">
              <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">Created</button>
              <button onClick={sidebarUtil.onGoToAssignedPRUrl} className="btn btn-sm">Assigned</button>
              <button onClick={sidebarUtil.onGoToOwnPRUrl} className="btn btn-sm">Mentioned</button>
            </div>

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
