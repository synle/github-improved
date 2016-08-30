import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import dataUtil from '@src/util/dataUtil';

const TokenRequestForm = React.createClass({
  render() {
      if(!this.props.isVisible){
          return null;
      }

      const onPromptTokenRequest = () => {
          const apiToken = _.trim( prompt('Enter your API Token below', '') );

          if (_.size(apiToken) > 0){
              dataUtil.setPersistedProp('api-token', apiToken);
              location.reload();
          }
      }

      return (
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h4>Settings</h4>
              </div>
              <div className="panel-body">
                <div>For better experience of the extension (relavant commits, contributors, etc.), we need to access to your api token.</div>
                <div><a href="https://github.com/settings/tokens">Generate New Personal Token Here</a></div>
                <button onClick={onPromptTokenRequest} className="btn btn-sm margin-top0">
                    Update API Token
                </button>
              </div>
          </div>
      );
  }
});


const mapStateToProps = function(state) {
  return {
      isVisible : _.size( _.get( state, 'data.apiToken' ) ) === 0
  };
}

export default connect(mapStateToProps)(TokenRequestForm);
