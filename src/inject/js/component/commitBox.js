import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

class CommitBox extends Component{
	render() {
	    const { commits, owner, repo, visible } = this.props;
	  	const commitCount = _.size(commits);
	    let bodyDom;

	  	if(visible.commit !== true){
	        return null;
	    }else if(!!owner && !!repo && commitCount > 0){
	        bodyDom = commits.map((repoCommit, idx) => {
				const author = repoCommit.author;
				const commit = repoCommit.commit;
				const commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);
				const shortCommitMessage = _.truncate( commit.message, {
					length: 70,
					omission : '...'
				});
				const domId = `commit-sha-${repoCommit.sha}`;

				return(
					<div key={domId} className="side-bar-commit-logs flex-column border-bottom">
	            		<a href={commitUrl}
	            		className="flex-grow1"
	            		title={commit.message}>
	        				{shortCommitMessage}
	            		</a>
	            		<span>{commit.author.date}</span>
	            		<strong>{commit.author.name}</strong>
					</div>
				);
			});
	  	} else if(!!owner && !!repo){
	  		bodyDom = <div>Loading...</div>
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
	commits : _.get( state, 'commits', []),
	owner : _.get( state, 'owner'),
	repo : _.get( state, 'repo'),
	visible : _.get( state, 'visible')
}))(CommitBox);
