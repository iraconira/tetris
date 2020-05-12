import React, { Component } from 'react';
import StartStopButton from './startStopButton';
// import HoldButton from './holdButton';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  addStyle = (button) => {
    return button ? { background: '#ff000060', transform: 'scale(1.1)' } : {};
  };

  render() {
    const { keyPress, pressedButton, displayHold } = this.props;
    return (
      <div className='controls'>
        <div className='left-block'>
          <button
            type='button'
            className='control-left'
            style={this.addStyle(pressedButton.left)}
            onMouseDown={(_e) => keyPress(_e, 'left')}
          >
            <span className='arrow'> &#8598;</span>
            {/* <p className='text'>left</p> */}
          </button>
          <button
            type='button'
            className='control-down'
            style={this.addStyle(pressedButton.down)}
            onMouseDown={(_e) => keyPress(_e, 'down')}
          >
            <span className='arrow'> &#8598;</span>
            {/* <p className='text'>down</p> */}
          </button>
          <button
            type='button'
            className='control-right'
            style={this.addStyle(pressedButton.right)}
            onMouseDown={(_e) => keyPress(_e, 'right')}
          >
            <span className='arrow'> &#8598;</span>
            {/* <p className='text'>right</p> */}
          </button>
        </div>

        <div className='middle-block'>
          <StartStopButton
            displayStartButton={this.props.displayStartButton}
            paused={this.props.paused}
            startGame={this.props.startGame}
            stopGame={this.props.stopGame}
          />
        </div>

        <div className='right-block'>
          <button
            type='button'
            className='control-twist'
            style={this.addStyle(pressedButton.twist)}
            onMouseDown={(_e) => keyPress(_e, 'rotate')}
          >
            <span className='arrow'> &#8634;</span>
            {/* <p className='text'>space</p> */}
          </button>

          {(displayHold && (
            <button
              className='hold'
              style={this.addStyle(pressedButton.hold)}
              onMouseDown={(_e) => keyPress(_e, 'hold')}
            >
              hold
            </button>
          )) || (
            <button
              className='hold'
              style={this.addStyle(pressedButton.hold)}
              onMouseDown={(_e) => keyPress(_e, 'use')}
            >
              use
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Controls;
