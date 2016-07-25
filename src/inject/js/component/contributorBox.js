import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';


const ContributorBox = React.createClass({
  render: function() {
    let bodyDom;
  	if(!!this.props.owner && !!this.props.repo && _.size(this.props.contributors) > 0){
        bodyDom = this.props.contributors.map((contributor) => {
            const author = contributor.author;
            const totalContributions = contributor.total;
            const commitByAuthorUrl = urlUtil.getCommitByAuthorUrl( author.login );
            const userProfileUrl = urlUtil.getUserProfileUrl( author.login );
            const tooltipText = `${author.login}'s commits`;
			const domId = `contributor-${author.login}`;

			return(
                <div key={domId} className="flex-row">
                    <div className="flex-grow1">
                        <a href={userProfileUrl}>{author.login}</a>
                        <a className="margin-left0 tooltipped tooltipped-s" href={commitByAuthorUrl} aria-label={tooltipText}>
                            <svg aria-hidden="true" className="octicon octicon-history" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M8 13H6V6h5v2H8v5zM7 1C4.81 1 2.87 2.02 1.59 3.59L0 2v4h4L2.5 4.5C3.55 3.17 5.17 2.3 7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-.34.03-.67.09-1H.08C.03 7.33 0 7.66 0 8c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"></path></svg>
                        </a>
                    </div>
                    <div className="flex-shrink0">{totalContributions}</div>
                </div>
			);
		})
  	} else if(!!this.props.owner && !!this.props.repo){
  		bodyDom = <div>Loading...</div>
  	} else {
  		return null;//hide it if no owner and repo
  	}


    return (
        <div className="panel panel-primary">
            <div className="panel-heading">
                <h4>Contributors</h4>
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
    contributors : _.get( state, 'contributors', []),
    owner : _.get( state, 'owner'),
    repo : _.get( state, 'repo')
  };
}

export default connect(mapStateToProps)(ContributorBox);
