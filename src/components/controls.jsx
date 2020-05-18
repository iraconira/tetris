import React, { Component } from 'react';
import StartStopButton from './startStopButton';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  addStyle = (button) => {
    return button ? { transform: 'scale(0.9)', bosxShadow: 'unset' } : {};
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
            <span className='arrow'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                width='1.5rem'
                height='1.5rem'
              >
                <path d='M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z' />
              </svg>
            </span>
          </button>
          <button
            type='button'
            className='control-down'
            style={this.addStyle(pressedButton.down)}
            onMouseDown={(_e) => keyPress(_e, 'down')}
          >
            <span className='arrow'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                width='1.5rem'
                height='1.5rem'
              >
                <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
              </svg>
            </span>
          </button>
          <button
            type='button'
            className='control-right'
            style={this.addStyle(pressedButton.right)}
            onMouseDown={(_e) => keyPress(_e, 'right')}
          >
            <span className='arrow'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                width='1.5rem'
                height='1.5rem'
              >
                <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
              </svg>
            </span>
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
            {/* <span className='arrow'> &#8634;</span> */}
            <span className='arrow'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                width='1.5rem'
                height='1.5rem'
              >
                <path d='M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z' />
              </svg>
            </span>
          </button>

          {(displayHold && (
            <button
              className='hold'
              style={this.addStyle(pressedButton.hold)}
              onMouseDown={(_e) => keyPress(_e, 'hold')}
            >
              <span className='text'>hold</span>
            </button>
          )) || (
            <button
              className='hold'
              style={this.addStyle(pressedButton.hold)}
              onMouseDown={(_e) => keyPress(_e, 'use')}
            >
              <span className='text'>use</span>
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Controls;
