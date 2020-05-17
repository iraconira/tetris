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
    const audioRef = this.audioRef.current;
    audioRef.setAttribute('src', sounds[sound]);
    audioRef.volume = volume;
    const playPromise = audioRef.play();
    this.playOnceReady(playPromise);
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
        <input
          id='volume'
          type='range'
          onChange={(_e) => this.handleVolume(_e)}
          min='0'
          max='1'
          value={value}
          step='0.01'
        />
        <audio ref={this.audioRef} src='' type='audio/mpeg'></audio>
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
