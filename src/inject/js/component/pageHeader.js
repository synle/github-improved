import React from 'react';
import { connect } from 'react-redux';

const PageHeader = React.createClass({
  render() {
    const expandStateLabel = '<<' || '>>';

    return (
      <h3 id="side-bar-title" className="flex-row">
        <span className="flex-grow1">Github Improved</span>
        <span className="btn flex-shrink0" onClick={this.onToggleSideBarVisibility}>{expandStateLabel}</span>
      </h3>
    );
  },
  onToggleIsExpanded(e){
    $('#side-bar-body-content').toggle();
  }
});


const mapStateToProps = function(state) {
  return {};
}

export default connect(mapStateToProps)(PageHeader);
