import React, { Component } from 'react';

class Sounds extends React.Component {
  componentDidMount() {
    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioTetris = document.getElementById('audio_tetris');
    const tetris = audioContext.createMediaElementSource(audioTetris);
    // tetris.connect(audioContext.destination);
    // audioTetris.play();

    // if (audioContext.state === 'suspended') {
    //   audioContext.resume();
    // }

    // function loadDogSound(url) {
    //   var request = new XMLHttpRequest();
    //   request.open('GET', url, true);
    //   request.responseType = 'arraybuffer';

    //   // Decode asynchronously
    //   request.onload = function () {
    //     audioContext.decodeAudioData(request.response, function (buffer) {
    //       let dogBarkingBuffer = buffer;
    //       playSound(dogBarkingBuffer);
    //     });
    //   };
    //   request.send();
    // }

    // loadDogSound('sounds/tetris.mp3');

    // function playSound(buffer) {
    //   var source = audioContext.createBufferSource(); // creates a sound source
    //   source.buffer = buffer; // tell the source which sound to play
    //   source.playbackRate.value = 2;
    //   source.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
    //   source.start(0); // play the source now
    // }

    const buffer = this.loadSound('sounds/tetris.mp3');
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
        this.playSound(audioContext, buffer, 1);
      });
    };
    request.send();
  };

  playSound = async (audioContext, buffer, speed = 1) => {
    const source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.playbackRate.value = speed;
    source.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source
    setTimeout(() => {
      source.disconnect(audioContext.destination);
      source.playbackRate.value = 1.05;
      source.connect(audioContext.destination);
    }, 3000);
  };

  render() {
    return (
      <>
        <audio
          id='audio_success'
          src='sounds/success.wav'
          type='audio/wav'
        ></audio>
        <audio
          id='audio_tetris'
          src='sounds/tetris.mp3'
          type='audio/mpeg'
        ></audio>
      </>
    );
  }
}

export default Sounds;
