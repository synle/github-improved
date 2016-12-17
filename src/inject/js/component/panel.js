import React from 'react';

// Panel
// <Panel domHeader={}
//   domBody={}
//   isExpanded={true}
//   />
const Panel = React.createClass({
  getInitialState() {
    return {
      isExpanded: this.props.isExpanded || false
    };
  },
  render: function() {
    let {domHeader, domBody} = this.props;
    const {isExpanded} = this.state;

    if(!isExpanded){
      domBody = null;
    }

    return(
      <div className="panel panel-primary">
        <div className="panel-heading" onClick={e => this.onToggleIsExpanded()}>
          <h4>{domHeader}</h4>
        </div>
        <div className="panel-body">
          {domBody}
        </div>
      </div>
    );
  },
  onToggleIsExpanded: function(){
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }
});

export default Panel;
