import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

const ContributorBox = React.createClass({
  render: function() {
    let bodyDom;
    const {visible, loading, trees, owner, repo, branch, path} = this.props;
    const treeCount = _.size(trees);

    if(visible !== true){
      return null;
    } else if(loading === true){
      bodyDom = <div>Loading...</div>
    } else if( treeCount > 0){
      bodyDom = trees.map( (treePath) => {
        const fileLink = `https://github.com/${owner}/${repo}/tree/${branch}/${treePath}`
        const key = `blob-${treePath}`;

        return (
          <div key={key} className="small-text">
            <a href={fileLink}>{treePath}</a>
          </div>
        );
      });
    } else {
      bodyDom = <div>Not Available...</div>;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>File Explorer</h4>
        </div>
        <div className="panel-body">
          <div><strong>{path}</strong></div>
          <div>{bodyDom}</div>
        </div>
      </div>
    );
  }
});


const mapStateToProps = function(state) {
  return {
    visible : _.get(state, 'ui.visible.fileExplorer'),
    loading : _.get(state, 'ui.loading.fileExplorer'),
    trees : _.get(state, 'repo.trees', []),
    repo : _.get( state, 'repo.repo'),
    owner : _.get( state, 'repo.owner'),
    branch: _.get( state, 'repo.branch'),
    path : _.get( state, 'repo.path')
  };
}

export default connect(mapStateToProps)(ContributorBox);
