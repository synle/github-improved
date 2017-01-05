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
  render() {
    let {domHeader, domBody} = this.props;
    let domExpandStateIcon;
    const {isExpanded} = this.state;

    if(!isExpanded){
      domBody = null;
      domExpandStateIcon = <span>&#9660;</span>; // ^
    } else {
      domBody = (
        <div className="panel-body padding0">
          {domBody}
        </div>
      );
      domExpandStateIcon = <span>&#9650;</span>; // v
    }

    return(
      <div className="panel panel-primary">
        <div className="panel-heading flex-row cpointer" onClick={e => this.onToggleIsExpanded()}>
          <h4 className="flex-grow1">{domHeader}</h4>
          <span className="flex-shrink0">{domExpandStateIcon}</span>
        </div>
        {domBody}
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
