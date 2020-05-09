import React, { Component } from 'react';
import Tetris from './components/tetris';
import Intro from './components/intro';
import './App.scss';

/* Functional Component */
class App extends Component {
  constructor() {
    super();

    this.state = {
      user: { name: 'aaa', score: 0 },
    };
  }

  handlePaused = (status) => {
    console.log('status: ', status);
    this.setState({ isPaused: status });
  };

  handleStart = (_e, name) => {
    _e.preventDefault();
    this.setState({ user: { name, score: 0 } });
    console.log('name: ', name);
  };

  render() {
    const { user } = this.state;
    return (
      <div className='app'>
        {/* {user.name === '' && (
          <Intro user={user} handleSubmit={this.handleStart} />
        )} */}

        {user.name !== '' && (
          /* <Tetris gameStatus={this.handlePaused} /> */
          <Tetris user={user} />
        )}
      </div>
    );
  }
}

export default App;
