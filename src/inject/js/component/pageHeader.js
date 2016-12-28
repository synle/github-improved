import React from 'react';
import { connect } from 'react-redux';

const PageHeader = React.createClass({
  render() {
    return (
      <h3 id="side-bar-title" className="flex-row">
        <span className="side-bar-title-text flex-grow1">Github Improved</span>
        <span className="side-bar-toggle btn flex-shrink0"
          onClick={this.onToggleSideBarVisibility}></span>
      </h3>
    );
  },
  onToggleSideBarVisibility(e) {
    $('#side-bar-body').toggleClass('collapsed-side-bar');
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PageHeader);
