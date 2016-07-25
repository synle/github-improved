import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

// commits.map((repoCommit) => {
// 	const author = repoCommit.author;
// 	const commit = repoCommit.commit;
// 	const commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);
// 	const shortCommitMessage = commit.message.substr(0, 50);
// 	$('<div class="side-bar-commit-logs flex-column border-bottom"/>')
// 		.append(`
// 		<a href="${commitUrl}"
// 		class="flex-grow1 tooltipped tooltipped-s"
// 		aria-label="${commit.message}">
// 				${shortCommitMessage}
// 		</a>
// 		<span>${commit.author.date}</span>
// 		<strong>${commit.author.name}</strong>
// 		`)
// 		.appendTo(commitContainer);
// });

const CommitBox = React.createClass({
  render: function() {
  	if(!!AppStore.owner && !!AppStore.repo){
        debugger;

		// const bodyDom = this.props.commits.map((repoCommit) => {
		// 	const author = repoCommit.author;
		// 	const commit = repoCommit.commit;
		// 	const commitUrl = urlUtil.getCommitUrlBySha(repoCommit.sha);
		// 	const shortCommitMessage = commit.message.substr(0, 50);
		// 	const domId = `commit-sha-${repoCommit.sha}`;
        //
		// 	return(
		// 		<div id="{domId}" class="side-bar-commit-logs flex-column border-bottom">
		// 			{shortCommitMessage}
		// 		</div>
		// 	);
		// })

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
  	} else {
  		return null;
  	}
  }
});


const mapStateToProps = function(state) {
  return {
    commits : _.get( state, 'commits', []);
  };
}

export default connect(mapStateToProps)(CommitBox);
