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

        //get the shortname
        var splits = treePath.split('/');
        let shortFileName = treePath;
        if(splits.length > 0){
          shortFileName = splits.pop();
        }

        return (
          <div key={key} className="small-text">
            <a href={fileLink}>{shortFileName}</a>
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
          <div>{bodyDom}</div>
        </div>
      </div>
    );
  }
});


const mapStateToProps = function(state) {
  let path = _.get( state, 'repo.path' ) || '';

  //
  let targetPathDir = path.split('/');
  targetPathDir.pop();
  targetPathDir = targetPathDir.join('/');

  const trees = targetPathDir.length === 0
    // root
    ? (_.get(state, 'repo.trees') || []).filter(
        treePath => treePath.indexOf('/') === -1
      )
    // non root path
    : (_.get(state, 'repo.trees') || []).filter(
      treePath => {
        if(path && path.length > 0){
          return treePath.indexOf(targetPathDir) === 0;
        }

        return treePath.indexOf('/') === -1;
      }
    );

  return {
    visible : _.get(state, 'ui.visible.fileExplorer'),
    loading : _.get(state, 'ui.loading.fileExplorer'),
    trees : _.slice( trees, 0, 40 ),//TODO: use constant for paging
    repo : _.get( state, 'repo.repo'),
    owner : _.get( state, 'repo.owner'),
    branch: _.get( state, 'repo.branch'),
    path : path
  };
}

export default connect(mapStateToProps)(ContributorBox);
