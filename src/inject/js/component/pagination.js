import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

const PAGE_SIZE_DEFAULT = 10;

// pagination
// <Pagination domList={...} pageSize={...} />
const Pagination = React.createClass({
  getInitialState() {
    return {
      isPagingEnabled: true,
      pageSize: this.props.pageSize || PAGE_SIZE_DEFAULT
    };
  },
  render() {
    let domToShow = this.props.domList || [];
    let pagingDom;

    const { isPagingEnabled } = this.state;

    if(domToShow.length > this.state.pageSize){
      if(isPagingEnabled){
        domToShow = _.slice(domToShow, 0, this.state.pageSize);

        pagingDom = (
          <div className="margin-top0">
            <button className="btn btn-sm btn-default"
              onClick={e => this.onTogglePagingEnable(false)}>More...</button>
          </div>
        );
      } else {
        pagingDom = (
          <div className="margin-top0">
            <button className="btn btn-sm btn-default"
              onClick={e => this.onTogglePagingEnable(true)}>Less...</button>
          </div>
        );
      }
    }

    return (
      <div>
        {domToShow}
        {pagingDom}
      </div>
    );
  },
  onTogglePagingEnable: function(isPagingEnabled){
    this.setState({
      isPagingEnabled: isPagingEnabled
    });
  }
});

export default Pagination;
