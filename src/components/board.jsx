import React, { Component } from 'react'
// deep clone for prevent old state overriting the modified state
import cloneDeep from 'lodash/cloneDeep'
import { getRandomFigure, twistFigure } from '../utils/figures'
import NextFigure from './nextFigure'
import Greed from './greed'

class Board extends Component {
  constructor(props) {
    super(props)

    this.boardRef = React.createRef()

    this.state = {
      rows: 20,
      cols: 10,
      timeInterval: 1000,
      allTimeIntervals: [],
      level: 1,
      time: 0,
      paused: false,
      displayStartButton: true,
      score: 0,
      currentFigure: [],
      nextFigure: [],
      board: [
        {},
        // { x: 3, y: 6, color: 'red' },
        // { x: 4, y: 7, color: 'red' },
        // { x: 5, y: 2, color: 'red' },
        // //
        // { x: 3, y: 0, color: 'blue' },
        // { x: 3, y: 1, color: 'blue' },
        // { x: 3, y: 2, color: 'blue' },
        // { x: 3, y: 3, color: 'blue' },
        // { x: 3, y: 4, color: 'blue' },
        // { x: 3, y: 5, color: 'blue' },
        // { x: 3, y: 6, color: 'blue' },
        // { x: 3, y: 7, color: 'blue' },
        // { x: 3, y: 8, color: 'blue' },
        // { x: 3, y: 9, color: 'blue' },
        // { x: 3, y: 10, color: 'blue' },
        // { x: 3, y: 11, color: 'blue' },
        // { x: 3, y: 12, color: 'blue' },
        // { x: 3, y: 13, color: 'blue' },
        // { x: 3, y: 14, color: 'blue' },
        // { x: 3, y: 15, color: 'blue' },
        // { x: 3, y: 16, color: 'blue' },
        // { x: 3, y: 17, color: 'blue' },
        // { x: 3, y: 18, color: 'blue' },
        // { x: 3, y: 19, color: 'blue' },
        // //
        // { x: 0, y: 19, color: 'lightblue' },
        // { x: 1, y: 19, color: 'lightblue' },
        // { x: 2, y: 19, color: 'lightblue' },
        // { x: 3, y: 19, color: 'lightblue' },
        // { x: 4, y: 19, color: 'lightblue' },
        // { x: 5, y: 19, color: 'lightblue' },
        // { x: 6, y: 19, color: 'lightblue' },
        // { x: 7, y: 19, color: 'lightblue' },
        // { x: 8, y: 19, color: 'lightblue' },
        // { x: 9, y: 19, color: 'lightblue' },
      ],
    }
  }

  componentDidMount() {
    // this.removeFullRows()
    // this.setRandomFigure()
  }

  startGame = (_e) => {
    let { displayStartButton } = this.state
    this.setRandomFigure()
    this.boardRef.current.focus()
    this.startTimer()
    setInterval(() => this.removeFullRows(), 100)

    displayStartButton = !displayStartButton
    this.setState({ displayStartButton })
    // emit start event
    this.props.gameStatus(false)
    this.preventDoubleClick(_e)
  }

  stopGame = (_e) => {
    let { paused, displayStartButton } = this.state
    paused = !paused
    displayStartButton = !displayStartButton
    this.setState({ paused, displayStartButton })
    this.startTimer()
    this.boardRef.current.focus()

    // emit stop event
    this.props.gameStatus(paused ? true : false)
    this.preventDoubleClick(_e)
  }

  preventDoubleClick = (_e) => {
    let btn = _e.target
    _e.stopPropagation()
    btn.setAttribute('disabled', '')
    setTimeout(() => btn.removeAttribute('disabled'), 1000)
  }

  incrementScore = (rows) => {
    let score = 10
    switch (rows) {
      case 1:
        break
      case 2:
        score *= 2
        break
      case 3:
        score *= 4
        break
      case 4:
        score *= 10
        break
      default:
      //
    }

    this.setState((prevState) => ({ score: prevState.score + score }))
  }

  incrementSpeed = () => {
    const { score } = this.state

    let timeInterval = 1000,
      level = 1
    switch (true) {
      case score >= 500:
        timeInterval = 100
        level = 8
        break
      case score >= 450:
        timeInterval = 200
        level = 7
        break
      case score >= 400:
        timeInterval = 300
        level = 6
        break
      case score >= 350:
        timeInterval = 400
        level = 5
        break
      case score >= 200:
        timeInterval = 500
        level = 4
        break
      case score >= 150:
        timeInterval = 600
        level = 3
        break
      case score >= 100:
        timeInterval = 700
        level = 2
        break
      case score >= 50:
        timeInterval = 800
        level = 1
        break
      default:
      //
    }

    this.state.allTimeIntervals.forEach((interval) => clearInterval(interval))
    this.setState({ timeInterval, allTimeIntervals: [], level })
    this.startTimer()
  }

  removeFullRows = () => {
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
    })

    // get the row where all cols are filled
    const matchings = allRows.filter((row) => row.length === cols)

    //set score
    if (matchings && matchings.length) {
      this.incrementScore(matchings.length)
      this.incrementSpeed()
    }

    // delete the rows that are filled
    matchings.forEach((rowToDelete) => {
      if (rowToDelete && rowToDelete.length === cols) {
        rowToDelete.forEach((match) => {
          // console.log('match: ', match)
          board.forEach((item) => {
            if (item.x === match[0] && item.y === match[1]) {
              // console.log('deleted item: ', item)
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

    const gameIsRunning = setInterval(() => {
      if (this.state.paused) {
        clearInterval(gameIsRunning)
      }
      const { board, currentFigure, nextFigure } = { ...this.state }
      // console.log('nexfigure: ', nextFigure[0].figure)
      // If not next figure, take current (for game start)
      const droppedFigure = cloneDeep(currentFigure)

      if (!this.state.paused) {
        droppedFigure.forEach((figUnit) => {
          figUnit.y++
        })
      }

      const maxY = Math.max.apply(
        Math,
        currentFigure.map((figUnit) => figUnit.y)
      )

      const collision = this.detectCollisions(board, droppedFigure)

      if (maxY > this.state.rows - 2 || collision) {
        if (maxY <= 2) {
          this.gameOver()
          return
        }
        // console.table([board])
        this.setState({
          board: [...board, ...currentFigure],
          currentFigure: [],
        })
        this.setRandomFigure()
        this.setState({ currentFigure: nextFigure })

        // for increase interval speed we need to remove all intervals
        let allTimeIntervals = this.state.allTimeIntervals
        allTimeIntervals.push(gameIsRunning)
        this.setState({ allTimeIntervals })

        return
      }

      return this.updateFigureStateAfterMoving(
        currentFigure,
        droppedFigure,
        collision
      )
    }, timeInterval)
  }

  setRandomFigure = () => {
    this.setState({
      currentFigure: getRandomFigure(this.state.cols),
      nextFigure: getRandomFigure(this.state.cols),
    })
  }

  gameOver = () => {
    console.log('GAME OVER')
    // let { board } = { ...this.state }
    // board.map((item) => board.splice(board.indexOf(item)))
    new Promise((resolve) => {
      this.state.allTimeIntervals.forEach((interval) => clearInterval(interval))
      resolve()
    }).then(() =>
      this.setState({ board: [], currentFigure: [], nextFigure: [] })
    )
  }

  fillBg = (x, y) => {
    // set filled default items
    const { board, currentFigure } = this.state
    let style = {}

    const setFigureStyle = (figure) => {
      if (figure.x === x && figure.y === y) {
        style.background = figure.color
        style.border = '1px solid black'
        style.borderRadius = '.5em'
        style.boxShadow = '2px 2px 2px grey'
      }
    }

    board.forEach((figure) => setFigureStyle(figure))
    currentFigure.forEach((figure) => setFigureStyle(figure))

    return style
  }

  handleKeyDown = (_e) => {
    const { paused } = this.state
    if (!paused) {
      if (_e.keyCode === 32) return this.rotateFigure()
      return this.moveFigure(_e)
    }
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
    const { board, currentFigure, cols } = this.state
    let twistedFigure = twistFigure(currentFigure)

    let collision = this.detectCollisions(board, twistedFigure)

    const LRCollision = twistedFigure[0].x > cols / 2 ? 'R' : 'L'

    // avoid infinite recursion when can't spin
    let collisionTimes = 0
    const reCheckCollision = (board, twistedFigure) => {
      if (collision && collisionTimes <= 3) {
        twistedFigure.forEach((figUnit, index) => {
          LRCollision === 'L'
            ? twistedFigure[index].x++
            : twistedFigure[index].x--
        })
        collision = this.detectCollisions(board, twistedFigure)
        collisionTimes++
        return reCheckCollision(board, twistedFigure)
      }
    }
    reCheckCollision(board, twistedFigure)

    return this.updateFigureStateAfterMoving(
      currentFigure,
      twistedFigure,
      collision
    )
  }

  injectButton = () => {
    const { displayStartButton, paused } = this.state

    let btn = ''

    if (!paused && displayStartButton) {
      btn = <button onClick={this.startGame}>Start Game</button>
    } else if (paused) {
      btn = <button onClick={this.stopGame}>Resume</button>
    } else {
      btn = <button onClick={this.stopGame}>Pause</button>
    }

    return btn
  }

  render() {
    let { rows, cols, nextFigure, score, level } = this.state

    return (
      <React.Fragment>
        <h1>
          Score: {score} Level:{level}
        </h1>
        {nextFigure && nextFigure.length > 0 && (
          <NextFigure nextFigure={nextFigure} />
        )}
        <div
          className='board'
          onKeyDown={this.handleKeyDown}
          tabIndex='0'
          ref={this.boardRef}
        >
          <Greed cols={cols} rows={rows} fillBg={this.fillBg} />
        </div>
        {this.injectButton()}
      </React.Fragment>
    )
  }
}

export default Board
