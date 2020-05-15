import React, { Component } from 'react';

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
    };

    this.audioRef = React.createRef();
  }

  async componentDidMount() {
    await this.loadSound('sounds/tetris.mp3');
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

  loadSound = async (path) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    // Decode asynchronously
    request.onload = () => {
      audioContext.decodeAudioData(request.response, (buffer) => {
        // this.playTetrisMusic(audioContext, buffer, 1);
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        source.buffer = buffer;
        source.loop = true;
        source.start(0);
        this.setState({ buffer, audioContext, source, gainNode });
      });
    };
    await request.send();
  };

  playTetrisMusic = (start, speed = 1, vol = null) => {
    const { audioContext, source, gainNode, volume } = this.state;
    source.playbackRate.value = speed;

    gainNode.gain.value = vol ? vol : volume;

    if (start) {
      source.connect(gainNode).connect(audioContext.destination);
      this.setState({ playing: true });
    } else {
      source.playbackRate.value = speed;
      source.disconnect(gainNode);
      this.setState({ playing: false });
    }
  };

  playSound = (sound) => {
    const { volume } = this.state;
    const audioRef = this.audioRef.current;
    audioRef.setAttribute('src', `sounds/${sound}.wav`);
    audioRef.volume = volume;
    setTimeout(() => audioRef.play(), 100);
  };

  handleVolume = (_e) => {
    const { paused } = this.props;
    const { speed } = this.state;

    const vol = _e.target.value;
    this.setState({ volume: vol });

    if (!paused) {
      this.playTetrisMusic(true, speed, vol);
    }
    setTimeout(() => document.querySelector('.board').focus(), 100);
  };

  render() {
    return (
      <div id='volume-slider'>
        <input
          id='volume'
          type='range'
          onChange={(_e) => this.handleVolume(_e)}
          min='0'
          max='1'
          value={this.state.value}
          step='0.01'
        />
        <audio ref={this.audioRef} src='' type='audio/wav'></audio>
      </div>
    );
  }
}

export default Music;
