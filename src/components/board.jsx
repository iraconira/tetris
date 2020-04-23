import React, { Component } from 'react'
// deep clone for prevent old state overriting the modified state
import cloneDeep from 'lodash/cloneDeep'
import { getFigure, getCenteredFigure } from '../utils/figures'
import Row from './row'

class Board extends Component {
  constructor() {
    super()

    this.state = {
      rows: 20,
      cols: 10,
      currentFigure: [],
      board: [
        { x: 3, y: 3, color: 'red' },
        { x: 4, y: 3, color: 'red' },
        { x: 5, y: 3, color: 'red' },
        { x: 3, y: 7, color: 'pink' },
        { x: 3, y: 8, color: 'pink' },
      ],
    }
  }

  componentDidMount() {
    this.setRandomFigure()
  }

  generateFigure = (figure, position, color) => {
    let items = []
    // const shape = getCenteredFigure(figure, position)
    const shape = getFigure(figure, position)
    shape.map((coord) => {
      items.push({
        x: coord[0],
        y: coord[1],
        color,
      })
    })
    return items
  }

  setRandomFigure = () => {
    const currentFigure = this.generateFigure('T', 'left', 'green')
    console.log(currentFigure)
    this.setState({ currentFigure })
  }

  fillBg = (x, y) => {
    // set filled default items
    const { board, currentFigure } = this.state
    let style = { background: 'transparent' }
    board.forEach((figure) => {
      if (figure.x === x && figure.y === y) {
        style.background = figure.color
      }
    })
    // set current figure
    currentFigure.forEach((figure) => {
      if (figure.x === x && figure.y === y) {
        style.background = figure.color
      }
    })

    return style
  }

  moveFigure = (_e) => {
    // R-39, L-37, D-40
    let increment = 0,
      coord = 'x'

    switch (_e.keyCode) {
      case 39:
        coord = 'x'
        increment = 1
        break
      case 37:
        coord = 'x'
        increment = -1
        break
      case 40:
        coord = 'y'
        increment = 1
        break
      default:
    }

    let { board, currentFigure } = { ...this.state }

    // let movedFigure = [...this.state.currentFigure] NOT WORKING
    let movedFigure = cloneDeep(currentFigure)

    movedFigure.forEach((fig) => (fig[coord] += increment))

    let coincidences = false

    board.forEach((boardUnit) => {
      movedFigure.forEach((figUnit) => {
        if (
          (boardUnit.x === figUnit.x && boardUnit.y === figUnit.y) ||
          figUnit.x < 0 ||
          figUnit.x > this.state.cols - 1 ||
          figUnit.y > this.state.rows - 1
        ) {
          console.log('match! ', [figUnit.x, figUnit.y])
          coincidences = true
        } else {
        }
      })
    })

    if (!coincidences) {
      this.setState({ currentFigure: movedFigure })
      coincidences = false
    } else {
      this.setState((prevState) => ({
        currentFigure,
      }))
    }
  }

  render() {
    const { rows, cols } = this.state
    const rowsArray = Array.from(new Array(rows).keys())
    const colArray = Array.from(new Array(cols).keys())

    return (
      <div className='board' onKeyDown={this.moveFigure} tabIndex='0'>
        {rowsArray.map((row, y) => (
          <div key={String(row + y)} className='row'>
            {colArray.map((col, x) => (
              <div
                key={String(col + x)}
                className='hub'
                x={x}
                y={y}
                style={this.fillBg(x, y)}
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
