import React, { Component } from 'react';
import { Howl, Howler } from 'howler';

class Music extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      soundRunning: false,
      audio: {},
    };

    this.audioRef = React.createRef();
    this.musicRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ audio: this.props.audio });
  }

  componentDidUpdate() {
    const { paused, sound } = this.props;
    const { playing, soundRunning } = this.state;

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

    if (sound && sound !== '' && !soundRunning) {
      this.setState({ soundRunning: true });
      this.playSound(sound);

      setTimeout(() => {
        this.setState({ soundRunning: false });
      }, 500);
    }
  }

  playTetrisMusic = (start, vol = null) => {
    const { audio } = this.state;

    if (start) {
      audio.tetris.play();
      this.setState({ playing: true });
    } else {
      audio.tetris.pause();
      this.setState({ playing: false });
    }
  };

  playSound = (sound) => {
    console.log(sound);
    const { audio } = this.state;
    audio[sound].play();
  };

  handleVolume = (_e) => {
    const vol = _e.target.value;
    Howler.volume(vol);

    setTimeout(() => document.querySelector('.board').focus(), 100);
  };

  render() {
    const { value } = this.state;
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
      </div>
    );
  }
}

export default Music;
