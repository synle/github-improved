import React from 'react';

//internal
import dataUtil from '@src/util/dataUtil';

// <LinkPjax url="..." />
const LinkPjax = React.createClass({
  render() {
    return (
      <a onClick={this.onLinkPjaxClick}>
        {this.props.children}
      </a>
    );
  },
  onLinkPjaxClick(){
    dataUtil.fetchPjaxCall(this.props.url);
  }
});

export default LinkPjax;
