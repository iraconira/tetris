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
    }
  }

  handlePaused = (status) => {
    console.log('status: ', status)
    this.setState({ isPaused: status })
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
