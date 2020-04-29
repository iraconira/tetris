import React, { Component } from 'react'

class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='controls'>
        <button className='control-left'>
          <span className='arrow'> &#8598;</span>
          <p className='text'>left</p>
        </button>
        <button className='control-down'>
          <span className='arrow'> &#8598;</span>
          <p className='text'>down</p>
        </button>
        <button className='control-right'>
          <span className='arrow'> &#8598;</span>
          <p className='text'>right</p>
        </button>
        <button className='control-twist'>
          <span className='arrow'> &#8634;</span>
          <p className='text'>space</p>
        </button>
      </div>
    )
  }
}

export default Controls
