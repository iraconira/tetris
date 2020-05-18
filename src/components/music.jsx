import React, { Component } from 'react';
import clear from '../sounds/clear.mp3';
import fall from '../sounds/fall.mp3';
import gameover from '../sounds/gameover.mp3';
import line from '../sounds/line.mp3';
import selection from '../sounds/selection.mp3';
import success from '../sounds/success.mp3';
import tetris from '../sounds/tetris.mp3';

class Music extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      audioContext: null,
      source: null,
      playing: false,
      speed: 1,
      statusLevel: 1,
      volume: 0.5,
      sounds: {
        clear,
        fall,
        gameover,
        line,
        selection,
        success,
        tetris,
      },
    };

    this.audioRef = React.createRef();
    this.musicRef = React.createRef();
  }

  componentDidUpdate() {
    const { paused, level, sound } = this.props;
    const { playing, speed, statusLevel } = this.state;

    if (!playing) {
      if (!paused) {
        this.setState({ playing: true });
        this.playTetrisMusic(true);
      }
    }

    if (playing) {
      if (paused) {
        this.setState({ playing: false });
        this.playTetrisMusic(false);
      }
    }

    if (parseInt(level) !== parseInt(statusLevel)) {
      const newSpeed = speed + 0.01;
      this.playTetrisMusic(true, newSpeed);
      this.setState({ statusLevel: level, speed: newSpeed });
    }

    if (sound && sound) {
      setTimeout(() => {
        this.playSound(sound);
      }, 100);
    }
  }

  playTetrisMusic = (start, vol = null) => {
    const { volume } = this.state;
    const musicRef = this.musicRef.current;

    musicRef.volume = vol ? vol : volume;
    let playPromise = null;

    musicRef.loop = true;

    if (start) {
      playPromise = musicRef.play();
      this.setState({ playing: true });
    } else {
      playPromise = musicRef.pause();
      this.setState({ playing: false });
    }

    this.playOnceReady(playPromise);
  };

  playOnceReady = (romise) => {
    if (romise !== undefined) {
      romise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
  };

  playSound = (sound) => {
    const { volume, sounds } = this.state;
    const audio = new Audio(sounds[sound]);
    audio.volume = volume;
    audio.play();
  };

  handleVolume = (_e) => {
    const { paused } = this.props;

    const vol = _e.target.value;
    this.setState({ volume: vol });

    if (!paused) {
      this.playTetrisMusic(true, vol);
    }
    setTimeout(() => document.querySelector('.board').focus(), 100);
  };

  render() {
    const { value, sounds } = this.state;
    return (
      <div id='volume-slider'>
        <span className='volume-icon'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='darkslategray'
            width='1rem'
            height='1rem'
          >
            <path d='M14 8.83v6.34L11.83 13H9v-2h2.83L14 8.83M16 4l-5 5H7v6h4l5 5V4z' />
          </svg>
        </span>
        <input
          id='volume'
          type='range'
          onChange={(_e) => this.handleVolume(_e)}
          min='0'
          max='1'
          value={value}
          step='0.01'
        />
        <span className='volume-icon'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='darkslategray'
            width='1rem'
            height='1rem'
          >
            <path d='M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z' />
          </svg>
        </span>
        <audio
          ref={this.musicRef}
          src={sounds.tetris}
          type='audio/mpeg'
        ></audio>
      </div>
    );
  }
}

export default Music;
