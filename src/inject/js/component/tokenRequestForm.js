import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import AppAction from '@src/store/appAction';
import dataUtil from '@src/util/dataUtil';

//internal components
import Panel from '@src/component/panel';

const TokenRequestForm = React.createClass({
  render() {
      if(!this.props.isVisible){
          return null;
      }

      const domHeader = 'Settings';
      const domBody = (
        <div>
          <div>For better experience of the extension (relavant commits, contributors, etc.), we need to access to your api token.</div>
          <div><a href="https://github.com/settings/tokens">Generate New Personal Token Here</a></div>
          <button onClick={this.onPromptTokenRequest} className="btn btn-sm margin-top0">
              Update API Token
          </button>
        </div>
      );

      return (
        <Panel domHeader={domHeader}
          domBody={domBody}
          isExpanded={true}
          />
      );
  },
  onPromptTokenRequest(){
    const apiToken = _.trim( prompt('Enter your API Token below') ) || '';

    if (_.size(apiToken) > 0){
      this.props.onUpdateApiToken(apiToken);
    }
  }
});


const mapStateToProps = function(state) {
  return {
      isVisible : _.get( state, 'ui.visible.tokenRequestForm' )
  };
}


const mapDispatchToProps = function(dispatch) {
  return {
   onUpdateApiToken: bindActionCreators(AppAction.updateApiToken, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenRequestForm);
