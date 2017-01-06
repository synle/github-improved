import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import Pagination from '@src/component/pagination';
import Panel from '@src/component/panel';
import dataUtil from '@src/util/dataUtil';

const PAGE_SIZE_FILE_EXPLORER = 15;

const ContributorBox = React.createClass({
  render() {
    let domBody;
    const {visible, loading, explorerFiles} = this.props;

    if(visible !== true){
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if( _.size(explorerFiles) > 0){
      domBody = explorerFiles.map( (explorerFile) => {
        const { filename, blob_url } = explorerFile;
        const key = `blob-${filename}`;

        //get the shortname
        var splits = filename.split('/');
        let shortFileName = filename;
        if(splits.length > 0){
          shortFileName = splits.pop();
        }

        return (
            <div key={key} className="small-text">
              <a onClick={() => this.onFileClick(blob_url)}
                className="tooltipped tooltipped-ne"
                aria-label={filename}>{shortFileName}</a>
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
  },
  onFileClick(blob_url){
    dataUtil.fetchPjaxCall(blob_url);
  }
});


const mapStateToProps = function(state) {
  return {
    visible : _.get(state, 'ui.visible.fileExplorer'),
    loading : _.get(state, 'ui.loading.fileExplorer'),
    explorerFiles: _.get(state, 'repo.explorerFiles') || []
  };
}

export default connect(mapStateToProps)(ContributorBox);
