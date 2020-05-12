import React, { Component } from 'react';

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
    return (
      <form
        className='intro'
        onSubmit={(_e) => this.props.handleSubmit(_e, name)}
      >
        <h1>enter your nickname</h1>
        <input
          className='intro-input'
          type='text'
          onChange={this.handleKeyPress}
          value={this.state.name}
          maxLength={12}
        />
        {(name && (
          <button
            type='submit'
            className='start-game'
            // disabled={!name}
          >
            start game
          </button>
        )) || <div className='triangle-up'></div>}
        <div className='instructions'></div>
      </form>
    );
  }
}

export default Intro;
