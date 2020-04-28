import React, { Component } from 'react'
import Timer from './components/timer'
import Board from './components/board'
import Intro from './components/intro'
import './App.scss'

/* Functional Component */
class App extends Component {
  constructor() {
    super()

    this.state = {
      isPaused: true,
      user: null,
    }
  }

  handlePaused = (status) => {
    console.log('status: ', status)
    this.setState({ isPaused: status })
  }

  render() {
    return (
      <div className='app'>
        <Intro user={this.state.user} />
        {/* <Timer timerType='crono' isPaused={this.state.isPaused} />
        <Board gameStatus={this.handlePaused} /> */}
      </div>
    )
  }
}

export default App
