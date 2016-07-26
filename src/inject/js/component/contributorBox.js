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
                    </div>
                    <div className="flex-shrink0">
                		<a className="margin-left0 tooltipped tooltipped-w" href={commitByAuthorUrl} aria-label={tooltipText}>
                			{totalContributions}
            			</a>
        			</div>
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
