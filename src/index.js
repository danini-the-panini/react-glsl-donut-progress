import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './Demo';

class DemoWithSlider extends React.Component {
  state = {
    percent: 0
  }

  onChange = ({ target: { value }}) => {
    this.setState({ percent: value });
  }

  render() {
    return (
      <div>
        <Demo percent={this.state.percent / 100.0} background={[1.0, 1.0, 1.0]} />
        <div>{this.state.percent}</div>
        <input type="range" onChange={this.onChange} value={this.state.percent} />
      </div>
    )
  }
}

ReactDOM.render(<DemoWithSlider />, document.getElementById('root'));
