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
    const {visible, loading, trees, owner, repo, branch, path, isPullRequestPage} = this.props;
    const treeCount = _.size(trees);

    if(visible !== true){
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if( treeCount > 0){
      domBody = trees.map( (tree) => {
        const { filename, blob_url } = tree;
        const key = `blob-${filename}`;

        //get the shortname
        var splits = filename.split('/');
        let shortFileName = filename;
        if(splits.length > 0){
          shortFileName = splits.pop();
        }

        return (
            <div key={key} className="small-text">
              <a href={blob_url}>{shortFileName}</a>
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
  const isPullRequestPage = _.get( state, 'repo.isPullRequestPage' ) || false;
  let path = _.get( state, 'repo.path' ) || '';
  let trees = _.get(state, 'repo.explorerFiles') || [];

  if(!isPullRequestPage){
    // non pr mode
    // we need to filter based on file path...

    let targetPathDir = path.split('/');
    if(targetPathDir.length > 1){
      targetPathDir.pop();
    }
    targetPathDir = targetPathDir.join('/');

    trees = targetPathDir.length === 0
      // root
      ? trees.filter(
          treePath => treePath.filename.indexOf('/') === -1
        )
      // non root path
      : trees.filter(
        treePath => {
          const filename = treePath.filename;

          if(path && path.length > 0){
            // start with target path and not having any slash after that
            return filename.indexOf(targetPathDir) === 0
              && filename.lastIndexOf('/') <= targetPathDir.length;
          }

          return filename.indexOf('/') === -1;
        }
      );
  }

  return {
    visible : _.get(state, 'ui.visible.fileExplorer'),
    loading : _.get(state, 'ui.loading.fileExplorer'),
    isPullRequestPage,
    trees,
    path,
    repo : _.get( state, 'repo.repo'),
    owner : _.get( state, 'repo.owner'),
    branch: _.get( state, 'repo.branch')
  };
}

export default connect(mapStateToProps)(ContributorBox);
