import React, { Component } from 'react';
import Tetris from './components/tetris';
import Intro from './components/intro';
import './App.scss';

//import sounds
import { Howl, Howler } from 'howler';
import sound_clear from './sounds/clear.mp3';
import sound_fall from './sounds/fall.mp3';
import sound_gameover from './sounds/gameover.mp3';
import sound_line from './sounds/line.mp3';
import sound_selection from './sounds/selection.mp3';
import sound_success from './sounds/success.mp3';
import sound_tetris from './sounds/tetris.mp3';

/* Functional Component */
class App extends Component {
  constructor() {
    super();

    this.state = {
      user: { name: '', score: 0 },
      audio: {},
    };
  }

  componentDidMount() {
    // Signature`;
    console.log(
      '%c Made with ♥ by Irakli M.',
      `color:white; 
      font-size:26px;
      padding:20px;
      background:black;
       border:5px solid tomato;`
    );
    this.loadSounds();
  }

  loadSounds = async () => {
    const selection = new Howl({
      src: [sound_selection],
    });
    const success = new Howl({
      src: [sound_success],
    });
    const clear = new Howl({
      src: [sound_clear],
    });
    const fall = new Howl({
      src: [sound_fall],
    });
    const line = new Howl({
      src: [sound_line],
    });
    const gameover = new Howl({
      src: [sound_gameover],
    });
    const tetris = new Howl({
      src: [sound_tetris],
      loop: true,
    });
    // await selection.on('load', () => console.log('loaded'));
    // await success.on('load', () => console.log('success'));
    // await clear.on('load', () => console.log('clear'));
    // await fall.on('load', () => console.log('fall'));
    // await line.on('load', () => console.log('line'));
    // await gameover.on('load', () => console.log('gameover'));
    await tetris.on('load', () => {
      console.log('sounds loaded');
      this.setState({
        audio: {
          selection,
          success,
          clear,
          fall,
          line,
          gameover,
          tetris,
        },
      });
    });
  };

  handlePaused = (status) => {
    this.setState({ isPaused: status });
  };

  handleStart = (_e, name) => {
    _e.preventDefault();
    this.setState({ user: { name, score: 0 } });
  };

  render() {
    const { user, audio } = this.state;
    return (
      <div className='app'>
        {user.name === '' && (
          <Intro user={user} handleSubmit={this.handleStart} />
        )}

        {user.name !== '' && <Tetris user={user} audio={audio} />}
      </div>
    );
  }
}

export default App;
