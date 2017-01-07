import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';
import LinkPjax from '@src/component/linkPjax';
import Pagination from '@src/component/pagination';
import Panel from '@src/component/panel';

const PAGE_SIZE_FILE_EXPLORER = 15;

const ContributorBox = React.createClass({
  render() {
    let domBody;
    const {visible, loading, explorerFiles, isPullRequestPage} = this.props;

    if(visible !== true){
      return null;
    } else if(loading === true){
      domBody = <div>Loading...</div>
    } else if( _.size(explorerFiles) > 0){
      domBody = explorerFiles.map( (explorerFile) => {
        const { filename, blob_url, status } = explorerFile;
        const key = `blob-${filename}`;

        //get the shortname
        var splits = filename.split('/');
        let shortFileName = filename;
        if(splits.length > 0){
          shortFileName = splits.pop();
        }

        // file status in pr mode (deleted, modified, added)
        let domFileStatus = null;
        if(isPullRequestPage){
          let fileStatusColorStyle = '';
          switch(status){
            case 'modified':
              domFileStatus = <span>~</span>;
              fileStatusColorStyle = 'yellow';
              break;
            case 'renamed':
              domFileStatus = <span>></span>;
              fileStatusColorStyle = 'yellow';
              break;
            case 'added':
              domFileStatus = <span>+</span>;
              fileStatusColorStyle = '#a6f3a6';
              break;
            case 'deleted':
            case 'removed':
              domFileStatus = <span>-</span>;
              fileStatusColorStyle = '#f8cbcb';
              break;
            default:
              domFileStatus = <span>?</span>;
              fileStatusColorStyle = 'orange';
              break;
          }

          fileStatusColorStyle = {
            'background-color' : fileStatusColorStyle
          };

          domFileStatus = (
            <strong className="margin-right0 tooltipped tooltipped-ne"
              aria-label={status}
              style={fileStatusColorStyle}>{domFileStatus}</strong>
          );
        }

        return (
            <div key={key} className="small-text">
              {domFileStatus}
              <LinkPjax url={blob_url}>
                <span className="tooltipped tooltipped-ne"
                  aria-label={filename}>{shortFileName}</span>
              </LinkPjax>
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
  return {
    visible : _.get(state, 'ui.visible.fileExplorer'),
    loading : _.get(state, 'ui.loading.fileExplorer'),
    explorerFiles: _.get(state, 'repo.explorerFiles') || [],
    isPullRequestPage: _.get(state, 'repo.isPullRequestPage') || false,
  };
}

export default connect(mapStateToProps)(ContributorBox);
