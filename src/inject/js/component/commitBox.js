import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import Pagination from '@src/component/pagination';

const PAGE_SIZE_COMMIT_LIST = 15;

class CommitBox extends Component{
  render() {
    const { visible, loading, commits, owner, repo } = this.props;
    const commitCount = _.size(commits);
    let bodyDom;

    if(visible !== true){
      return null;
    } else if(loading === true){
      bodyDom = <div>Loading...</div>
    } else if(!!owner && !!repo && commitCount > 0){
      bodyDom = commits.map((repoCommit, idx) => {
        const author = repoCommit.author;
        const commit = repoCommit.commit;
        const sha = repoCommit.sha;
        const commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);
        const shortCommitMessage = _.truncate( commit.message, {
          length: 70,
          omission : '...'
        });
        const domId = `commit-sha-${repoCommit.sha}`;

        const commitDate = _.get( commit, 'author.date');
        const commitAuthorName = _.get( commit, 'author.name');

        return(
          <div key={domId} className="side-bar-commit-logs small-text flex-column border-bottom">
            <a href={commitUrl}
            className="flex-grow1"
            title={commit.message}
            data-sha={sha}>
              {shortCommitMessage}
            </a>
            <strong>{commitAuthorName}</strong>
          </div>
        );
      });

      //wrap it in the paging
      bodyDom = <Pagination domList={bodyDom} pageSize={PAGE_SIZE_COMMIT_LIST}></Pagination>
    } else {
      bodyDom = <div>Not Available Here</div>
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Commits</h4>
        </div>
        <div className="panel-body">
          {bodyDom}
        </div>
      </div>
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
