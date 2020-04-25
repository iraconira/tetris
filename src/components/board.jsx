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
        // { x: 3, y: 6, color: 'red' },
        // { x: 4, y: 7, color: 'red' },
        // { x: 5, y: 2, color: 'red' },
        //
        // { x: 0, y: 4, color: 'pink' },
        // { x: 1, y: 4, color: 'pink' },
        // { x: 2, y: 4, color: 'pink' },
        // { x: 3, y: 4, color: 'pink' },
        // { x: 4, y: 4, color: 'pink' },
        // { x: 5, y: 4, color: 'pink' },
        // { x: 6, y: 4, color: 'pink' },
        // { x: 7, y: 4, color: 'pink' },
        // { x: 8, y: 4, color: 'pink' },
        // { x: 9, y: 4, color: 'pink' },
        // //
        // { x: 0, y: 3, color: 'yellow' },
        // { x: 1, y: 5, color: 'yellow' },
        // { x: 2, y: 5, color: 'yellow' },
        // { x: 3, y: 5, color: 'yellow' },
        // { x: 4, y: 5, color: 'yellow' },
        // { x: 5, y: 5, color: 'yellow' },
        // { x: 6, y: 5, color: 'yellow' },
        // { x: 7, y: 5, color: 'yellow' },
        // { x: 8, y: 5, color: 'yellow' },
        // { x: 9, y: 5, color: 'yellow' },
        // //
        // { x: 0, y: 9, color: 'brown' },
        // { x: 1, y: 9, color: 'brown' },
        // { x: 2, y: 9, color: 'brown' },
        // { x: 3, y: 9, color: 'brown' },
        // { x: 4, y: 9, color: 'brown' },
        // { x: 5, y: 7, color: 'brown' },
        // { x: 6, y: 9, color: 'brown' },
        // { x: 7, y: 9, color: 'brown' },
        // { x: 8, y: 9, color: 'brown' },
        // { x: 9, y: 9, color: 'brown' },
        // //
        // { x: 0, y: 10, color: 'blue' },
        // { x: 1, y: 10, color: 'blue' },
        // { x: 2, y: 10, color: 'blue' },
        // { x: 3, y: 10, color: 'blue' },
        // { x: 4, y: 10, color: 'blue' },
        // { x: 5, y: 1, color: 'blue' },
        // { x: 6, y: 1, color: 'blue' },
        // { x: 7, y: 10, color: 'blue' },
        // { x: 8, y: 10, color: 'blue' },
        // { x: 9, y: 10, color: 'blue' },
        // //
        // { x: 0, y: 0, color: 'lightblue' },
        // { x: 1, y: 0, color: 'lightblue' },
        // { x: 2, y: 0, color: 'lightblue' },
        // { x: 3, y: 0, color: 'lightblue' },
        // { x: 4, y: 0, color: 'lightblue' },
        // { x: 5, y: 0, color: 'lightblue' },
        // { x: 6, y: 0, color: 'lightblue' },
        // { x: 7, y: 0, color: 'lightblue' },
        // { x: 8, y: 0, color: 'lightblue' },
        // { x: 9, y: 0, color: 'lightblue' },
      ],
    }
  }

  componentDidMount() {
    // this.checkFullRows()
    // this.setRandomFigure()
  }

  startGame = () => {
    this.setRandomFigure()
    this.boardRef.current.focus()
    this.startTimer()
  }

  // deleteRow = () => {}

  checkFullRows = () => {
    const { rows, cols, board } = { ...this.state }

    let emptyArray = Array.from(Array(rows).keys())
    let allRows = emptyArray.map((row) => [])

    // generate all rows
    board.forEach((hub) => {
      allRows.forEach((row, index) => {
        if (index === hub.y) {
          allRows[index].push([hub.x, hub.y])
        }
      })
      // console.log('hub; ', allRows)
    })

    // get the row where all cols are filled
    const matchings = allRows.filter((row) => row.length === cols)
    console.log('yea, match: ', matchings)

    // delete the rows that are filled
    matchings.forEach((rowToDelete) => {
      if (rowToDelete && rowToDelete.length === cols) {
        rowToDelete.forEach((match) => {
          // console.log('match: ', match)
          board.forEach((item) => {
            if (item.x === match[0] && item.y === match[1]) {
              console.log('deleted item: ', item)
              board.splice(board.indexOf(item), 1)
            }
          })
        })
      }
      // console.log('board > ', board)
      // console.log('rowToDeleteYcoor: ', rowToDelete[0][1])
      board.forEach((item) => {
        if (item.y < rowToDelete[0][1]) {
          item.y++
        }
      })

      // drop all rows that were over the ful line
    })

    // setTimeout(() => {
    this.setState({ board })
    // }, 2000)
  }

  startTimer = () => {
    const { timeInterval } = this.state

    setInterval(() => {
      this.checkFullRows()

      const { board, currentFigure } = { ...this.state }
      const droppedFigure = cloneDeep(currentFigure)

      droppedFigure.forEach((figUnit) => {
        figUnit.y++
      })

      const maxY = Math.max.apply(
        Math,
        currentFigure.map((figUnit) => figUnit.y)
      )
      // console.log(maxY)

      const collision = this.detectCollisions(board, droppedFigure)

      if (maxY > this.state.rows - 2 || collision) {
        this.setState({
          board: [...board, ...currentFigure],
          currentFigure: [],
        })

        this.setRandomFigure()

        console.log('END')
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
          // console.log('collision!! ', [figUnit.x, figUnit.y])
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
