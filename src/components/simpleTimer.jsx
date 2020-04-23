import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SimpleTimer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: new Date().toLocaleTimeString(),
    }
  }

  componentDidMount() {
    setInterval(() => {
      const time = new Date().toLocaleTimeString()
      this.setState({ time })
    }, 1000)
  }

  render() {
    const { time } = this.state
    return <div className='simpletimer'>{time}</div>
  }
}

export default SimpleTimer
