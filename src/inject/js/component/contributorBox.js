import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import Pagination from '@src/component/pagination';
import Panel from '@src/component/panel';

const PAGE_SIZE_CONTRIBUTOR_LIST = 5;

const ContributorBox = React.createClass({
  getInitialState() {
    return {
      showPaging: false
    };
  },
  render: function() {
    let domBody;
    const { visible, loading, contributors } = this.props;
    const contributorCount = _.size(contributors);

    if( visible !== true ){
      //shouldn't show here
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if( contributorCount > 0){
      domBody = contributors.map((contributor) => {
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
      });


      //wrap it in the paging
      domBody = <Pagination domList={domBody} pageSize={PAGE_SIZE_CONTRIBUTOR_LIST}></Pagination>
    } else {
      domBody = <div>Not Available...</div>;
    }


    const domHeader = 'Contributors';

    return (
      <Panel domHeader={domHeader}
        domBody={domBody}
        isExpanded={false} />
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
