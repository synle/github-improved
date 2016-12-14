import React from 'react';
import { connect } from 'react-redux';

const PageHeader = React.createClass({
  render: function() {
    return (
      <h3 id="side-bar-title ta-center">Github Improved Toolbox</h3>
    );
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PageHeader);
