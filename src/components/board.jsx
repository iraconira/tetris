import React, { Component } from 'react'
// deep clone for prevent old state overriting the modified state
import cloneDeep from 'lodash/cloneDeep'
import { getFigure, getRandomFigure, twistFigure } from '../utils/figures'

class Board extends Component {
  constructor() {
    super()

    this.boardRef = React.createRef()

    this.state = {
      rows: 20,
      cols: 10,
      timeInterval: 1000,
      currentFigure: [],
      board: [
        {},
        // { x: 3, y: 3, color: 'red' },
        // { x: 4, y: 3, color: 'red' },
        // { x: 5, y: 3, color: 'red' },
        // { x: 3, y: 7, color: 'pink' },
        // { x: 3, y: 8, color: 'pink' },
      ],
    }
  }

  componentDidMount() {
    this.setRandomFigure()
  }

  startGame = () => {
    this.boardRef.current.focus()
    this.startTimer()
  }

  startTimer = () => {
    const { timeInterval } = this.state

    setInterval(() => {
      const { board, currentFigure } = { ...this.state }

      const droppedFigure = cloneDeep(currentFigure)

      droppedFigure.forEach((figUnit) => {
        figUnit.y++
      })

      const maxY = Math.max.apply(
        Math,
        currentFigure.map((figUnit) => figUnit.y)
      )
      console.log(maxY)

      const collision = this.detectCollisions(board, droppedFigure)

      if (maxY > this.state.rows - 2 || collision) {
        this.setState({
          board: [...board, ...currentFigure],
          currentFigure: [],
        })

        this.setRandomFigure()

        console.log('GAME OVER')
        return
      }

      return this.updateFigureStateAfterMoving(
        currentFigure,
        droppedFigure,
        collision
      )
    }, timeInterval)
  }

  generateFigure = (figure, position, color) => {
    let items = []
    // const shape = getCenteredFigure(figure, position)
    const shape = getFigure(figure, position)
    shape.map((coord) => {
      items.push({
        x: coord[0] + this.state.cols / 2 - 2,
        y: coord[1],
        color,
        figure,
        position,
      })
    })
    return items
  }

  setRandomFigure = () => {
    // let currentFigure = this.generateFigure('Z', 'up', 'green')
    let currentFigure = getRandomFigure(this.state.cols)
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

  handleKeyDown = (_e) => {
    if (_e.keyCode === 32) return this.rotateFigure()
    return this.moveFigure(_e)
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

    const { board, currentFigure } = { ...this.state }
    // const movedFigure = [...this.state.currentFigure] NOT WORKING. We need lodash!
    const movedFigure = cloneDeep(currentFigure)

    movedFigure.forEach((fig) => (fig[coord] += increment))

    const collision = this.detectCollisions(board, movedFigure)
    console.log('collision: ', collision)
    return this.updateFigureStateAfterMoving(
      currentFigure,
      movedFigure,
      collision
    )
  }

  detectCollisions = (board, movedFigure) => {
    let collision = false

    board.forEach((boardUnit) => {
      movedFigure.forEach((figUnit) => {
        if (
          (boardUnit.x === figUnit.x && boardUnit.y === figUnit.y) ||
          figUnit.x < 0 ||
          figUnit.x > this.state.cols - 1 ||
          figUnit.y > this.state.rows - 1
        ) {
          console.log('collision!! ', [figUnit.x, figUnit.y])
          collision = true
        }
      })
    })

    return collision
  }

  updateFigureStateAfterMoving = (currentFigure, movedFigure, collision) => {
    if (!collision) {
      this.setState({ currentFigure: movedFigure })
      collision = false
    } else {
      this.setState({ currentFigure })
    }
  }

  rotateFigure = () => {
    const { board, currentFigure } = this.state
    const twistedFigure = twistFigure(currentFigure)

    const collision = this.detectCollisions(board, twistedFigure)
    return this.updateFigureStateAfterMoving(
      currentFigure,
      twistedFigure,
      collision
    )
  }

  render() {
    const { rows, cols } = this.state
    const rowsArray = Array.from(new Array(rows).keys())
    const colArray = Array.from(new Array(cols).keys())

    return (
      <React.Fragment>
        <div
          className='board'
          onKeyDown={this.handleKeyDown}
          tabIndex='0'
          ref={this.boardRef}
        >
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
        <button onClick={this.startGame}>Start</button>
      </React.Fragment>
    )
  }
}

export default Board
