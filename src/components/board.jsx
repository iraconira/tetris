import React, { Component } from 'react'
import { getFigure } from '../utils/figures'
import Row from './row'

class Board extends Component {
  constructor() {
    super()

    this.state = {
      rows: 20,
      cols: 10,
      figures: [
        // getFigure('T', 'right'),
        getFigure('L', 'left'),
        [
          [0, 9],
          [1, 9],
          [2, 9],
        ],
      ],
    }
  }

  print = (x, y) => {
    let style = { background: 'transparent' }

    this.state.figures.forEach((fig) => {
      fig.forEach((coord) => {
        if (coord[0] === x && coord[1] === y) {
          console.log('match > ', x + y)
          style.background = 'green'
        }
      })
    })
    return style
  }

  render() {
    const { rows, cols } = this.state
    const rowsArray = Array.from(new Array(rows).keys())
    const colArray = Array.from(new Array(cols).keys())

    return (
      // <div className='board'>
      //   {rowsArray.map((row, index) => (
      //     <Row
      //       columns={state.columns}
      //       colored={index === state.element.x}
      //       element={state.element}
      //     />
      //   ))}
      // </div>
      <div className='board'>
        {rowsArray.map((row, x) => (
          <div key={String(row + x)} className='row'>
            {colArray.map((col, y) => (
              <div
                key={String(col + y)}
                className='hub'
                x={x}
                y={y}
                style={this.print(x, y)}
              >
                {x},{y}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Board
