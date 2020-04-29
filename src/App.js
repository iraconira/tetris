import React, { Component } from 'react'
import Board from './components/board'
import Intro from './components/intro'
import './App.scss'

/* Functional Component */
class App extends Component {
  constructor() {
    super()

    this.state = {
      user: { name: '' },
    }
  }

  handlePaused = (status) => {
    console.log('status: ', status)
    this.setState({ isPaused: status })
  }

  handleStart = (_e, name) => {
    _e.preventDefault()
    this.setState({ user: { name } })
    console.log('name: ', name)
  }

  render() {
    const { user } = this.state
    return (
      <div className='app'>
        {user.name === '' && (
          <Intro user={user} handleSubmit={this.handleStart} />
        )}

        {user.name !== '' && (
          <div className='game-wrapper'>
            {/* <Board gameStatus={this.handlePaused} /> */}
            <Board />
          </div>
        )}
      </div>
    )
  }
}

export default App
