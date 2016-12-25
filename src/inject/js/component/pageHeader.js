import React from 'react';
import { connect } from 'react-redux';

const PageHeader = React.createClass({
  render: function() {
    return (
      <h3 id="side-bar-title" className="flex-row">
        <span className="flex-grow1">Github Improved</span>
        <span className="flex-shrink0">+/-</span>
      </h3>
    );
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PageHeader);
