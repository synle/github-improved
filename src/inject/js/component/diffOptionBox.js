import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';
import Panel from '@src/component/panel';

//internal
const DiffBoxOption = React.createClass({
  render() {
      const {urlParams, visible} = this.props;

      if(!visible){
        return null;
      } else {
        let whiteSpaceText, cbWhitespaceChange;

        //diff whitespace
        if(urlParams.w !== '1'){
            whiteSpaceText = 'Ignore White Space';
            cbWhitespaceChange = sidebarUtil.onGoToDiffWhitespaceOffUrl;
        } else {
            whiteSpaceText = 'White Space Sensitive';
            cbWhitespaceChange = sidebarUtil.onGoToDiffWhitespaceOnUrl;
        }

        //diff format
        let diffFormatText, cbFormatChange;
        if(urlParams.diff !== 'split'){
            diffFormatText = 'Split Diff';
            cbFormatChange = sidebarUtil.onGoToSplitDiffUrl;
        } else {
            diffFormatText = 'Unified Diff';
            cbFormatChange = sidebarUtil.onGoToUnifieDiffUrl;
        }

        const domHeader = 'Diff Options';
        const domBody = (
          <div className="flex-row justify-content-space-between">
            <button onClick={cbWhitespaceChange} className="btn btn-sm">{whiteSpaceText}</button>
            <button onClick={cbFormatChange} className="btn btn-sm">{diffFormatText}</button>
          </div>
        );

        return(
          <Panel domHeader={domHeader}
            domBody={domBody}
            isExpanded={true}
            />
        );
      }
  }
});


const mapStateToProps = function(state) {
  return {
    visible : _.get(state, 'ui.visible.diffOptionBox'),
    urlParams : _.get( state, 'repo.urlParams', {})
  };
}

export default connect(mapStateToProps)(DiffBoxOption);
