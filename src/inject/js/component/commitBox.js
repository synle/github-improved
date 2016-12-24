import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import Pagination from '@src/component/pagination';
import Panel from '@src/component/panel';

const PAGE_SIZE_COMMIT_LIST = 15;

class CommitBox extends Component{
  render() {
    const { visible, loading, commits, owner, repo } = this.props;
    const commitCount = _.size(commits);
    let domBody;

    if(visible !== true){
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if(!!owner && !!repo && commitCount > 0){
      domBody = commits.map((repoCommit, idx) => {
        const {author, commit, commitUrl, sha, displayCommitMsg, commitAuthorShortName, commitAuthorName, commitDate} = repoCommit;

        return(
          <div key={sha} className="side-bar-commit-logs small-text border-bottom">
            <strong title={commitAuthorName}>{commitAuthorShortName}</strong>
            <a href={commitUrl}
              className="margin-left0"
              title={commit.message}
              data-sha={sha}>
              {displayCommitMsg}
            </a>
          </div>
        );
      });

      //wrap it in the paging
      domBody = <Pagination domList={domBody} pageSize={PAGE_SIZE_COMMIT_LIST}></Pagination>
    } else {
      domBody = <div>Not Available Here</div>
    }

    const domHeader = 'Commits';

    return (
      <Panel domHeader={domHeader}
        domBody={domBody}
        isExpanded={true} />
    );
    }
}

export default connect(state => ({
  visible : _.get(state, 'ui.visible.commitBox'),
  loading : _.get(state, 'ui.loading.commitBox'),
  commits : _.get( state, 'repo.commits', []),
  owner : _.get( state, 'repo.owner'),
  repo : _.get( state, 'repo.repo')
}))(CommitBox);
