import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

const ContributorBox = React.createClass({
  render: function() {
    let bodyDom;
    const {visible, loading, treesMap, owner, repo, branch, path} = this.props;
    const trees = _.get(treesMap, 'tree', []);
    const treeCount = _.size(trees);

    if(visible !== true){
      return null;
    } else if(loading === true){
      bodyDom = <div>Loading...</div>
    } else if( treeCount > 0){
      bodyDom = trees.map( (tree) => {
        const path = tree.path;
        const sha = tree.sha;
        const type = tree.type;
        const fileLink = `https://github.com/${owner}/${repo}/tree/${branch}/${path}`
        const key = `blob-${sha}`;

        const typeDom = type === 'tree' ? '> ' : '';

        return (
          <div key={key} className="small-text">
            <a href={fileLink} data-sha={sha}>{typeDom}{path}</a>
          </div>
        );
      })
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
    treesMap : _.get(state, 'repo.trees', {}),
    repo : _.get( state, 'repo.repo'),
    owner : _.get( state, 'repo.owner'),
    branch: _.get( state, 'repo.branch'),
    path : _.get( state, 'repo.path')
  };
}

export default connect(mapStateToProps)(ContributorBox);
