import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import sidebarUtil from '@src/util/sidebarUtil';

//internal
const DiffBoxOption = React.createClass({
  render() {
      const urlParams = this.props.urlParams || {};
      console.log('urlParams', urlParams);

      let whiteSpaceText, cbWhitespaceChange;
      if(urlParams.w !== '1'){
          whiteSpaceText = 'Diff Whitespace OFF';
          cbWhitespaceChange = sidebarUtil.onGoToDiffWhitespaceOffUrl;
      } else {
          whiteSpaceText = 'Diff Whitespace ON';
          cbWhitespaceChange = sidebarUtil.onGoToDiffWhitespaceOnUrl;
      }



      const diffFormatText = urlParams.diff !== 'split' ? 'Split Diff' : 'Unified Diff';
      const cbFormatChange = urlParams.diff !== 'split'
        ? sidebarUtil.onGoToSplitDiffUrl
        : sidebarUtil.onGoToUnifieDiffUrl;


      if($('.blob-num-addition, .blob-code-deletion').length > 0){
          return <div>
            <button onClick={cbWhitespaceChange} className="btn btn-sm">{whiteSpaceText}</button>
            <button onClick={cbFormatChange} className="btn btn-sm">{diffFormatText}</button>
          </div>;
      } else{
          return null;
      }
  }
});


const mapStateToProps = function(state) {
  return {
    urlParams : _.get( state, 'urlParams', {})
  };
}

export default connect(mapStateToProps)(DiffBoxOption);
