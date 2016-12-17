import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';


const PAGE_SIZE = 10;

const ContributorBox = React.createClass({
  getInitialState() {
    return {
      showPaging: false
    };
  },
  render: function() {
    let bodyDom, pagingDom;
    const { visible, loading, contributors } = this.props;
    const contributorCount = _.size(contributors);

    if( visible !== true ){
      //shouldn't show here
      return null;
    } else if(loading === true){
      bodyDom = <div>Loading...</div>
    } else if( contributorCount > 0){
      //whether or not to show paging.
      let contributorsToShow = contributors;
      if(contributorCount >= PAGE_SIZE){
        if(this.state.showPaging){
          // will show all if showPaging is not set...
          contributorsToShow = contributors;
          pagingDom = (
            <div>
              <button className="btn btn-sm btn-default"
                onClick={e => this.onToggleShowPaging(false)}>Show Less...</button>
            </div>
          );
        } else {
          // cap it at page size
          contributorsToShow = _.slice(contributors, 0, PAGE_SIZE);
          pagingDom = (
            <div>
              <button className="btn btn-sm btn-default"
                onClick={e => this.onToggleShowPaging(true)}>Show More...</button>
            </div>
          );
        }
      }

      bodyDom = contributorsToShow.map((contributor) => {
        const author = contributor.author;
        const totalContributions = contributor.total;
        const commitByAuthorUrl = urlUtil.getCommitByAuthorUrl( author.login );
        const userProfileUrl = urlUtil.getUserProfileUrl( author.login );
        const tooltipText = `${author.login}'s commits`;
        const domId = `contributor-${author.login}`;

        return(
          <div key={domId} className="small-text flex-row">
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

    // TODO: remove me
    // const contributorCountDom = contributorCount > 0
    //   ? <span>({contributorCount})</span>
    //   : null;


    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Contributors</h4>
        </div>
        <div className="panel-body">
          {bodyDom}
          {pagingDom}
        </div>
      </div>
    );
  },
  onToggleShowPaging: function(showPagingFlag){
    this.setState({
      showPaging: showPagingFlag
    });
  }
});


const mapStateToProps = function(state) {
  const contributorsList = _.reverse( _.get(state, 'repo.contributors') || [] );

  return {
    visible : _.get(state, 'ui.visible.contributorBox'),
    loading : _.get(state, 'ui.loading.contributorBox'),
    contributors : contributorsList
  };
}

export default connect(mapStateToProps)(ContributorBox);
