import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

const CommitBox = React.createClass({
  render: function() {
    let bodyDom;
  	if(!!this.props.owner && !!this.props.repo && _.size(this.props.commits) > 0){
        bodyDom = this.props.commits.map((repoCommit, idx) => {
			const author = repoCommit.author;
			const commit = repoCommit.commit;
			const commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);
			const shortCommitMessage = commit.message.substr(0, 50);
			const domId = `commit-sha-${repoCommit.sha}`;

			return(
				<div key={domId} className="side-bar-commit-logs flex-column border-bottom">
            		<a href={commitUrl}
            		className="flex-grow1 tooltipped tooltipped-s"
            		aria-label={commit.message}>
        				{shortCommitMessage}
            		</a>
            		<span>{commit.author.date}</span>
            		<strong>{commit.author.name}</strong>
				</div>
			);
		})
  	} else if(!!this.props.owner && !!this.props.repo){
  		bodyDom = <div>Loading...</div>
  	} else {
  		bodyDom = <div>Not Available Here</div>
  	}


    return (
        <div id="side-bar-commit-container" className="panel panel-primary">
            <div className="panel-heading">
                <h4>Commits</h4>
            </div>
            <div className="panel-body">
                {bodyDom}
            </div>
        </div>
    );
  }
});


const mapStateToProps = function(state) {
  return {
    commits : _.get( state, 'commits', []),
    owner : _.get( state, 'owner'),
    repo : _.get( state, 'repo')
  };
}

export default connect(mapStateToProps)(CommitBox);
