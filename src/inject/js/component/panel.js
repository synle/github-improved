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
    const {isExpanded} = this.state;

    if(!isExpanded){
      domBody = null;
    } else {
      domBody = (
        <div className="panel-body padding0">
          {domBody}
        </div>
      );
    }

    return(
      <div className="panel panel-primary">
        <div className="panel-heading" onClick={e => this.onToggleIsExpanded()}>
          <h4>{domHeader}</h4>
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
