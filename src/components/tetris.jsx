import React, { Component } from 'react';
import _ from 'lodash';
// deep clone for prevent old state overriting the modified state
import cloneDeep from 'lodash/cloneDeep';
import { getRandomFigure, twistFigure } from '../utils/figures';
import {
  incrementScore,
  incrementSpeed,
  getFilledRows,
  removeFilledRows,
  detectCollisions,
} from '../utils/helpers';
import NextFigure from './nextFigure';
import Timer from './timer';
import Greed from './greed';
import Controls from './controls';
import Display from './display';
import Sounds from './sounds';
// import StartStopButton from './startStopButton';

class Tetris extends Component {
  constructor(props) {
    super(props);

    this.boardRef = React.createRef();

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
      holdedFigure: [],
      displayHold: true,
      pressedButton: {
        left: false,
        right: false,
        twist: false,
        down: false,
        hold: false,
      },
      players: [],
      bestPlayer: {},
      board: [
        {},
        // { x: 3, y: 6, color: 'red' },
        // { x: 4, y: 7, color: 'red' },
        // { x: 5, y: 2, color: 'red' },
        // //
        // { x: 0, y: 4, color: 'blue' },
        // { x: 1, y: 4, color: 'blue' },
        // { x: 2, y: 4, color: 'blue' },
        // { x: 3, y: 4, color: 'blue' },
        // { x: 4, y: 4, color: 'blue' },
        // { x: 5, y: 4, color: 'blue' },
        // { x: 6, y: 4, color: 'blue' },
        // { x: 7, y: 4, color: 'blue' },
        // { x: 8, y: 4, color: 'blue' },
        // { x: 9, y: 4, color: 'blue' },
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
    };
  }

  componentDidMount() {
    // this.checkIfNeedCleanRows()
    // this.setRandomFigure()
    this.getBestPlayer();
  }

  startGame = (_e) => {
    let { displayStartButton, paused } = this.state;

    this.setRandomFigure();
    this.boardRef.current.focus();
    this.setState({ displayStartButton: !displayStartButton, paused: !paused });
    this.startTimer();
    setInterval(() => this.checkIfNeedCleanRows(), 100);

    // emit start event
    // this.props.gameStatus(false)
    this.preventDoubleClick(_e);
  };

  stopGame = (_e) => {
    let { paused } = this.state;
    // this.setState({ displayStartButton: !displayStartButton, paused: !paused })
    this.setState({ paused: paused === false });
    this.startTimer();
    this.boardRef.current.focus();

    // emit stop event
    // this.props.gameStatus(paused ? true : false)
    this.preventDoubleClick(_e);
  };

  holdFigure = () => {
    const { holdedFigure, paused } = this.state;

    if (holdedFigure.length === 0 && paused === false) {
      this.setState((prevState) => ({
        currentFigure: prevState.nextFigure,
        holdedFigure: prevState.currentFigure,
        nextFigure: getRandomFigure(this.state.cols),
        displayHold: false,
      }));
    }
  };

  useHoldedFigure = () => {
    const { holdedFigure, paused } = this.state;

    if (holdedFigure.length !== 0 && paused === false) {
      this.setState((prevState) => ({
        currentFigure: prevState.holdedFigure,
        holdedFigure: [],
        nextFigure: getRandomFigure(this.state.cols),
        displayHold: true,
      }));
    }
  };

  getBestPlayer = () => {
    const players = [this.props.user];
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers && savedPlayers.length)
      players.push(JSON.parse(savedPlayers));

    // console.table(players);
    const bestPlayer = _.maxBy(players, (item) => item.score);
    this.setState({ players, bestPlayer });
  };

  preventDoubleClick = (_e) => {
    let btn = _e.target;
    _e.stopPropagation();
    btn.setAttribute('disabled', '');
    setTimeout(() => btn.removeAttribute('disabled'), 1000);
  };

  checkScoreIntervalIncrement = (fullRows) => {
    const { score } = this.state;

    const newScore = incrementScore(fullRows.length) + score;
    const intLevel = incrementSpeed(newScore);

    // console.table({newLevel:intLevel.interval, score:intLevel.level});
    this.state.allTimeIntervals.forEach((interval) => clearInterval(interval));

    this.setState({
      score: newScore,
      timeInterval: intLevel.interval,
      allTimeIntervals: [],
      level: intLevel.level,
    });

    this.startTimer();
  };

  checkIfNeedCleanRows = () => {
    const { rows, cols, board } = { ...this.state };
    // // get the row where all cols are filled
    const rowsToRemove = getFilledRows(board, rows, cols);
    // incremt score and speed
    if (rowsToRemove && rowsToRemove.length)
      this.checkScoreIntervalIncrement(rowsToRemove);
    // delete the rows that are filled
    this.setState({ board: removeFilledRows(board, cols, rowsToRemove) });
  };

  startTimer = () => {
    const { timeInterval } = this.state;

    const gameIsRunning = setInterval(() => {
      if (this.state.paused) {
        clearInterval(gameIsRunning);
      }
      const { board, cols, rows, currentFigure, nextFigure } = {
        ...this.state,
      };
      // If not next figure, take current (for game start)
      const droppedFigure = cloneDeep(currentFigure);

      if (!this.state.paused) {
        droppedFigure.forEach((figUnit) => {
          figUnit.y++;
        });
      }

      const maxY = Math.max.apply(
        Math,
        currentFigure.map((figUnit) => figUnit.y)
      );

      const collision = detectCollisions(board, cols, rows, droppedFigure);

      if (collision) {
        // console.table({
        //   maxY: maxY,
        //   rows: this.state.rows,
        //   'maxY >= rows': maxY >= this.state.rows,
        // });

        this.setState({
          board: [...board, ...currentFigure],
          currentFigure: [],
        });
        this.setRandomFigure();
        this.setState({ currentFigure: nextFigure });

        if (maxY < 2) {
          this.gameOver();
          return;
        }

        // for increase interval speed we need to remove all intervals
        let allTimeIntervals = this.state.allTimeIntervals;
        allTimeIntervals.push(gameIsRunning);
        this.setState({ allTimeIntervals });

        return;
      }

      return this.updateFigureStateAfterMoving(
        currentFigure,
        droppedFigure,
        collision
      );
    }, timeInterval);
  };

  setRandomFigure = () => {
    this.setState({
      currentFigure: getRandomFigure(this.state.cols),
      nextFigure: getRandomFigure(this.state.cols),
    });
  };

  gameOver = () => {
    const { board } = { ...this.state };
    board.map((item) => (item.color = '#fffefe1f'));

    new Promise((resolve) => {
      this.state.allTimeIntervals.forEach((interval) =>
        clearInterval(interval)
      );
      resolve();
    }).then(() =>
      this.setState({
        board,
        currentFigure: [],
        nextFigure: [],
        paused: true,
        displayStartButton: true,
      })
    );
  };

  fillBg = (x, y) => {
    // set filled default items
    const { board, currentFigure } = this.state;
    let style = {};

    const setFigureStyle = (figure) => {
      if (figure.x === x && figure.y === y) {
        style.background = figure.color;
      }
    };

    board.forEach((figure) => setFigureStyle(figure));
    currentFigure.forEach((figure) => setFigureStyle(figure));

    return style;
  };

  lightedButton = (button) => {
    this.setState({ pressedButton: { [button]: true } });
    setTimeout(
      () => this.setState({ pressedButton: { [button]: false } }),
      200
    );
  };

  handleKeyDown = (_e, ctrlButton = null) => {
    // console.log('event: ', _e);
    const { paused, displayHold } = this.state;
    if (!paused) {
      // space
      if (_e.keyCode === 32 || ctrlButton === 'rotate') {
        this.lightedButton('twist');
        return this.rotateFigure();
      }

      // ctrl
      if (_e.keyCode === 17 || ctrlButton === 'hold' || ctrlButton === 'use') {
        console.log('key code: ', _e.keyCode);

        if (displayHold) {
          this.lightedButton('hold');
          return this.holdFigure();
        } else {
          this.lightedButton('hold');
          return this.useHoldedFigure();
        }
      }

      return this.moveFigure(_e, ctrlButton);
    }
  };

  moveFigure = (_e, ctrlButton = null) => {
    // R-39, L-37, D-40
    let increment = 0,
      coord = 'x';

    if (_e.keyCode === 39 || ctrlButton === 'right') {
      ctrlButton = 'right';
      coord = 'x';
      increment = 1;
    }

    if (_e.keyCode === 37 || ctrlButton === 'left') {
      ctrlButton = 'left';
      coord = 'x';
      increment = -1;
    }

    if (_e.keyCode === 40 || ctrlButton === 'down') {
      ctrlButton = 'down';
      coord = 'y';
      increment = 1;
    }

    this.lightedButton(ctrlButton);

    const { board, cols, rows, currentFigure } = { ...this.state };
    // const movedFigure = [...this.state.currentFigure] NOT WORKING. We need lodash!
    const movedFigure = cloneDeep(currentFigure);

    movedFigure.forEach((fig) => (fig[coord] += increment));

    const collision = detectCollisions(board, cols, rows, movedFigure);
    return this.updateFigureStateAfterMoving(
      currentFigure,
      movedFigure,
      collision
    );
  };

  updateFigureStateAfterMoving = (currentFigure, movedFigure, collision) => {
    if (!collision) {
      this.setState({ currentFigure: movedFigure });
      collision = false;
    } else {
      this.setState({ currentFigure });
    }
  };

  rotateFigure = () => {
    const { board, cols, rows, currentFigure } = this.state;
    let twistedFigure = twistFigure(currentFigure);

    let collision = detectCollisions(board, cols, rows, twistedFigure);

    const LRCollision = twistedFigure[0].x > cols / 2 ? 'R' : 'L';

    // avoid infinite recursion when can't spin
    let collisionTimes = 0;
    const reCheckCollision = (board, twistedFigure) => {
      if (collision && collisionTimes <= 3) {
        twistedFigure.forEach((figUnit, index) => {
          LRCollision === 'L'
            ? twistedFigure[index].x++
            : twistedFigure[index].x--;
        });
        collision = detectCollisions(board, cols, rows, twistedFigure);
        collisionTimes++;
        return reCheckCollision(board, twistedFigure);
      }
    };
    reCheckCollision(board, twistedFigure);

    return this.updateFigureStateAfterMoving(
      currentFigure,
      twistedFigure,
      collision
    );
  };

  render() {
    let {
      rows,
      cols,
      nextFigure,
      holdedFigure,
      score,
      level,
      paused,
      displayStartButton,
      pressedButton,
      displayHold,
    } = this.state;

    return (
      <div className='tetris' ref={this.boardRef}>
        <div className='widgets'>
          <Display
            title={'time'}
            content={<Timer timerType='crono' isPaused={paused} />}
            textAlign={'center'}
          />
          <Display title={'score'} content={score} textAlign={'center'} />
          <Display title={'level'} content={level} textAlign={'center'} />
        </div>
        <div className='board-wrapper'>
          <div className='board' onKeyDown={this.handleKeyDown} tabIndex='0'>
            <Greed cols={cols} rows={rows} fillBg={this.fillBg} />
          </div>
          {nextFigure && nextFigure.length > 0 && (
            <div className='preview-figures-wrapper'>
              <Display
                title={'next'}
                content={<NextFigure nextFigure={nextFigure} />}
                textAlign={'center'}
              />

              {holdedFigure && holdedFigure.length > 0 && (
                <Display
                  title={'holded'}
                  content={<NextFigure nextFigure={holdedFigure} />}
                  textAlign={'center'}
                />
              )}
            </div>
          )}
        </div>

        <Controls
          keyPress={this.handleKeyDown}
          pressedButton={pressedButton}
          displayStartButton={displayStartButton}
          paused={paused}
          startGame={this.startGame}
          stopGame={this.stopGame}
          displayHold={displayHold}
          holdFigure={this.holdFigure}
          useHoldedFigure={this.useHoldedFigure}
        />

        <Sounds />
      </div>
    );
  }
}

export default Tetris;
