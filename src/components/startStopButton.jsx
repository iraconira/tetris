import React, { Component } from 'react'

class StartStopButton extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { displayStartButton, paused, startGame, stopGame } = this.props

    return (
      <>
        {(paused && displayStartButton && (
          <div>
            <button className='start-stop' onClick={startGame}>
              start game
            </button>
            <div className='triangle-up'></div>
          </div>
        )) || (
          <div>
            <button className='start-stop' onClick={stopGame}>
              {paused ? 'resume' : 'pause'}
            </button>
          </div>
        )}
      </>
    )
  }
}

export default StartStopButton
