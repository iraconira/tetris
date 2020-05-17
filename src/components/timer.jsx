import React, { Component } from 'react';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      time: new Date().toLocaleTimeString(),
      paused: true,
      parsedTime: '',
    };
  }

  componentDidMount() {
    const { timerType } = this.props;
    timerType && timerType === 'crono' ? this.initCrono() : this.initTime();
  }

  initCrono = () => {
    setInterval(() => {
      if (!this.props.isPaused) {
        // this.setState((prevState) => ({ seconds: prevState.seconds++ }));
        this.setState((prevState) => ({ seconds: prevState.seconds + 1 }));
        const parsedTime = this.crono();
        this.props.crono(parsedTime);
      }
    }, 1000);
  };

  initTime = () => {
    setInterval(() => {
      const time = new Date().toLocaleTimeString();
      this.setState((prevState) => ({ time }));
    }, 1000);
  };

  crono = () => {
    const { seconds } = this.state;
    const min = Math.floor(seconds / 60);

    const sec = seconds > 59 ? seconds % 60 : seconds;
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
  };

  render() {
    const { timerType } = this.props;
    const { time } = this.state;
    const parsedTime = timerType && timerType === 'crono' ? this.crono() : time;

    return <>{parsedTime}</>;
  }
}

export default Timer;
