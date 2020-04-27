import React, { Component } from 'react'
import Timer from './components/timer'
import Board from './components/board'
import './App.scss'

/* Functional Component */
class App extends Component {
  constructor() {
    super()

    this.state = {
      isPaused: true,
      pauseTime: 0,
    }
  }

  handlePaused = (status) => {
    console.log('status: ', status)
    this.setState({ isPaused: status })
  }

  handleCrono = (seconds) => {
    console.log(seconds)
  }

  render() {
    return (
      <div className='app'>
        <Timer timerType='crono' isPaused={this.state.isPaused} />
        <Board gameStatus={this.handlePaused} />
      </div>
    )
  }
}

export default App
