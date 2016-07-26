import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


const TokenRequestForm = React.createClass({
  render() {
      if(!this.props.isVisible){
          return null;
      }

      const onPromptTokenRequest = () => {
          const apiToken = prompt('Enter your API Token below', '');
          localStorage['github-improved.api-token'] = apiToken;
          location.reload();
      }


      return (
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h4>Settings</h4>
              </div>
              <div className="panel-body">
                <button onClick={onPromptTokenRequest} className="btn btn-sm">
                    Update API Token
                </button>
              </div>
          </div>
      );
  }
});


const mapStateToProps = function(state) {
  return {
      isVisible : _.size( state.apiToken ) === 0
  };
}

export default connect(mapStateToProps)(TokenRequestForm);
