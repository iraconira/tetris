import React, { Component } from 'react'
// deep clone for prevent old state overriting the modified state
import cloneDeep from 'lodash/cloneDeep'
import { getRandomFigure, twistFigure } from '../utils/figures'
import NextFigure from './nextFigure'
import Timer from './timer'
import Greed from './greed'
import Controls from './controls'
import Display from './display'
import StartStopButton from './startStopButton'

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
      paused: true,
      displayStartButton: true,
      score: 0,
      currentFigure: [],
      nextFigure: [],
      pressedButton: {
        left: false,
        right: false,
        space: false,
        down: false,
      },
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
    let { displayStartButton, paused } = this.state

    console.log('started')

    this.setRandomFigure()
    this.boardRef.current.focus()
    this.setState({ displayStartButton: !displayStartButton, paused: !paused })
    this.startTimer()
    setInterval(() => this.removeFullRows(), 100)

    // emit start event
    // this.props.gameStatus(false)
    this.preventDoubleClick(_e)
  }

  stopGame = (_e) => {
    let { paused } = this.state
    // this.setState({ displayStartButton: !displayStartButton, paused: !paused })
    this.setState({ paused: !paused })
    this.startTimer()
    this.boardRef.current.focus()

    // emit stop event
    // this.props.gameStatus(paused ? true : false)
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
      this.setState({
        board: [],
        currentFigure: [],
        nextFigure: [],
        paused: true,
      })
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
        style.borderRadius = '4px'
        style.boxShadow = '2px 2px 2px grey'
      }
    }

    board.forEach((figure) => setFigureStyle(figure))
    currentFigure.forEach((figure) => setFigureStyle(figure))

    return style
  }

  lightedButton = (button) => {
    this.setState({ pressedButton: { [button]: true } })
    setTimeout(() => this.setState({ pressedButton: { [button]: false } }), 200)
  }

  handleKeyDown = (_e, ctrlButton = null) => {
    console.log('event: ', _e)
    const { paused } = this.state
    if (!paused) {
      if (_e.keyCode === 32 || ctrlButton === 'rotate') {
        this.lightedButton('space')
        return this.rotateFigure()
      }

      return this.moveFigure(_e, ctrlButton)
    }
  }

  moveFigure = (_e, ctrlButton = null) => {
    // R-39, L-37, D-40
    let increment = 0,
      coord = 'x'

    if (_e.keyCode === 39 || ctrlButton === 'right') {
      ctrlButton = 'right'
      coord = 'x'
      increment = 1
    }

    if (_e.keyCode === 37 || ctrlButton === 'left') {
      ctrlButton = 'left'
      coord = 'x'
      increment = -1
    }

    if (_e.keyCode === 40 || ctrlButton === 'down') {
      ctrlButton = 'down'
      coord = 'y'
      increment = 1
    }

    this.lightedButton(ctrlButton)

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

  render() {
    let {
      rows,
      cols,
      nextFigure,
      score,
      level,
      paused,
      displayStartButton,
      pressedButton,
    } = this.state

    return (
      <React.Fragment>
        <div className='left-block'>
          <StartStopButton
            displayStartButton={displayStartButton}
            paused={paused}
            startGame={this.startGame}
            stopGame={this.stopGame}
          />
          <div>
            <Display title={'score'} content={score} textAlign={'right'} />
            <br />
            <br />
            <Display title={'level'} content={level} textAlign={'right'} />
          </div>
        </div>

        <div
          className='board'
          onKeyDown={this.handleKeyDown}
          tabIndex='0'
          ref={this.boardRef}
        >
          <Greed cols={cols} rows={rows} fillBg={this.fillBg} />
          <Controls
            keyPress={this.handleKeyDown}
            pressedButton={pressedButton}
          />
        </div>
        <div className='right-block'>
          <div>
            <Display
              title={'time'}
              content={<Timer timerType='crono' isPaused={paused} />}
              textAlign={'left'}
            />
            <br />
            <br />
            {nextFigure && nextFigure.length > 0 && (
              <Display
                title={'next figure'}
                content={<NextFigure nextFigure={nextFigure} />}
                textAlign={'left'}
              />
            )}
          </div>
          <div>
            <Display
              title={'best player'}
              content={['jhon', 1234]}
              textAlign={'left'}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Board
