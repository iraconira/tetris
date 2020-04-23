import React, { Component } from 'react'
import Hub from './hub'
// import { PropTypes } from 'prop-types';

class Row extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnsArray: Array.from(new Array(this.props.columns).keys()),
    }
  }

  render() {
    const { columnsArray } = this.state
    return (
      <div className='row'>
        {this.props.colored ? 'yea' : 'no'}
        {columnsArray.map((row, index) => (
          <Hub full={this.props.colored} />
        ))}
      </div>
    )
  }
}

export default Row
