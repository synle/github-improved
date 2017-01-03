//external
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//internal
import AppAction from '@src/store/appAction';

const PageHeader = React.createClass({
  render() {
    return (
      <h3 id="side-bar-title" className="flex-row">
        <span className="side-bar-title-text flex-grow1 align-self-center"></span>
        <span className="side-bar-toggle btn flex-shrink0 align-self-center"
          onClick={this.props.onToggleSideBarVisibility}></span>
      </h3>
    );
  }
});


const mapStateToProps = function(state) {
  return {};
}

const mapDispatchToProps = function(dispatch) {
  return { onToggleSideBarVisibility: bindActionCreators(AppAction.toggleSideBarVisibility, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
