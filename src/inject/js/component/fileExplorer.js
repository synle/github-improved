import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import Pagination from '@src/component/pagination';
import Panel from '@src/component/panel';

const PAGE_SIZE_FILE_EXPLORER = 15;

const ContributorBox = React.createClass({
  render() {
    let domBody;
    const {visible, loading, trees, owner, repo, branch, path} = this.props;
    const treeCount = _.size(trees);

    if(visible !== true){
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if( treeCount > 0){
      domBody = trees.map( (treePath) => {
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

      //wrap it in the paging
      domBody = <Pagination domList={domBody} pageSize={PAGE_SIZE_FILE_EXPLORER}></Pagination>
    } else {
      return null;
    }

    const domHeader = 'File Explorer';

    return (
      <Panel domHeader={domHeader}
        domBody={domBody}
        isExpanded={true}
        />
    );
  }
});


const mapStateToProps = function(state) {
  let path = _.get( state, 'repo.path' ) || '';

  //
  let targetPathDir = path.split('/');
  targetPathDir.pop();
  targetPathDir = targetPathDir.join('/');

  const initalTrees = _.get(state, 'repo.trees') || [];
  const trees = targetPathDir.length === 0
    // root
    ? initalTrees.filter(
        treePath => treePath.indexOf('/') === -1
      )
    // non root path
    : initalTrees.filter(
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
    trees : trees,
    repo : _.get( state, 'repo.repo'),
    owner : _.get( state, 'repo.owner'),
    branch: _.get( state, 'repo.branch'),
    path : path
  };
}

export default connect(mapStateToProps)(ContributorBox);
