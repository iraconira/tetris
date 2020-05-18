import React, { Component } from 'react';
import instructions from '../images/instructions.png';

class Intro extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
    };
  }

  handleKeyPress = (_e) => {
    const { user } = { ...this.state };
    const char = _e.target.value;
    user.name = char;
    this.setState({ user });
  };

  render() {
    const { name } = this.state.user;
    const { loaded } = this.props;
    return (
      <>
        {(loaded && (
          <form
            className='intro'
            onSubmit={(_e) => this.props.handleSubmit(_e, name)}
          >
            <h1>enter your name</h1>
            <input
              className='intro-input'
              type='text'
              onChange={this.handleKeyPress}
              value={this.state.name}
              maxLength={12}
            />
            {(name && (
              <button type='submit' className='start-game'>
                start game
              </button>
            )) || <div className='triangle-up'></div>}
            <div
              className='instructions'
              style={{ backgroundImage: `url(${instructions})` }}
            ></div>
            <div className='copyright'>
              <div className='text-wrapper'>
                made with <span>&hearts;</span> by irakli m.
              </div>
            </div>
          </form>
        )) || (
          <div className='loading-wrapper'>
            <div className='tetris-loader'>
              <div className='block1'></div>
              <div className='block2'></div>
              <div className='block3'></div>
              <div className='block4'></div>
            </div>
            Loading ...
          </div>
        )}
      </>
    );
  }
}

export default Intro;
