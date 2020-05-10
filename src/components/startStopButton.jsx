import React, { Component } from 'react';

class StartStopButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { displayStartButton, paused, startGame, stopGame } = this.props;

    return (
      <>
        {(paused && displayStartButton && (
          <>
            <button className='start-stop' onClick={startGame}>
              start
            </button>
            <div className='triangle-up'></div>
          </>
        )) || (
          <>
            <button className='start-stop' onClick={stopGame}>
              {paused ? 'resume' : 'pause'}
            </button>
          </>
        )}
      </>
    );
  }
}

export default StartStopButton;
