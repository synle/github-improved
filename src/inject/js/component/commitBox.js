import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

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
    } else {
      bodyDom = <div>Not Available Here</div>
    }

    const commitCountDom = commitCount > 0
      ? <span>({commitCount})</span>
      : null;


    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Commits {commitCountDom}</h4>
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
