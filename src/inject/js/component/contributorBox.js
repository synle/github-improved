import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';


const ContributorBox = React.createClass({
  render: function() {
    let bodyDom;
    const { visible, loading, contributors } = this.props;
    const contributorCount = _.size(contributors);

    if( visible !== true ){
      //shouldn't show here
      return null;
    } else if(loading === true){
      bodyDom = <div>Loading...</div>
    } else if( contributorCount > 0){
      bodyDom = contributors.map((contributor) => {
        const author = contributor.author;
        const totalContributions = contributor.total;
        const commitByAuthorUrl = urlUtil.getCommitByAuthorUrl( author.login );
        const userProfileUrl = urlUtil.getUserProfileUrl( author.login );
        const tooltipText = `${author.login}'s commits`;
        const domId = `contributor-${author.login}`;

        return(
          <div key={domId} className="flex-row">
            <div className="flex-grow1">
              <a href={userProfileUrl} className="tooltipped tooltipped-e" aria-label="View profile">{author.login}</a>
            </div>
            <div className="flex-shrink0">
              <a className="margin-left0 tooltipped tooltipped-w" href={commitByAuthorUrl} aria-label={tooltipText}>
                {totalContributions}
              </a>
            </div>
          </div>
        );
      })
    } else {
      bodyDom = <div>Not Available...</div>;
    }

    const contributorCountDom = contributorCount > 0
      ? <span>({contributorCount})</span>
      : null;


    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Contributors {contributorCountDom}</h4>
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
    visible : _.get(state, 'ui.visible.contributorBox'),
    loading : _.get(state, 'ui.loading.contributorBox'),
    contributors : _.get(state, 'repo.contributors')
  };
}

export default connect(mapStateToProps)(ContributorBox);
