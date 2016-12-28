import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import sidebarUtil from '@src/util/sidebarUtil';

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

        if($('.blob-num-addition, .blob-code-deletion').length > 0){
            return(
                <div className="margin-top0">
                  <button onClick={cbWhitespaceChange} className="btn btn-sm">{whiteSpaceText}</button>
                  <button onClick={cbFormatChange} className="btn btn-sm margin-top0">{diffFormatText}</button>
                </div>
            );
        } else{
            return null;
        }
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
