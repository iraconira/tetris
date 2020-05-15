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
import Music from './music';
import UsersTable from './usersTable';
// import StartStopButton from './startStopButton';

class Tetris extends Component {
  constructor(props) {
    super(props);

    this.controlsRef = React.createRef();
    this.tableRef = React.createRef();

    this.state = {
      rows: 20,
      cols: 10,
      timeInterval: 1000,
      allTimeIntervals: [],
      level: 1,
      paused: true,
      displayStartButton: true,
      escBtnDisabled: true,
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
      gameOver: false,
      players: [],
      bestPlayer: {},
      sound: '',
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
    this.controlsRef.current.focus();
  }

  startGame = (_e) => {
    let { displayStartButton, paused } = this.state;

    this.setRandomFigure();
    this.setState({ displayStartButton: !displayStartButton, paused: !paused });
    this.startTimer();
    setInterval(() => this.checkIfNeedCleanRows(), 100);
    this.controlsRef.current.focus();

    // emit start event
    this.preventDoubleClick(_e);
  };

  stopGame = (_e) => {
    let { paused } = this.state;
    // this.setState({ displayStartButton: !displayStartButton, paused: !paused })
    this.setState({ paused: paused === false });
    this.startTimer();
    this.controlsRef.current.focus();

    // emit stop event
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

  getPlayersList = () => {
    const { time, level, score } = this.state;
    let players = [{ ...this.props.user, score, level, time }];
    let savedPlayers = localStorage.getItem('players');
    savedPlayers = JSON.parse(savedPlayers);

    if (savedPlayers && savedPlayers.length)
      players = [...players, ...savedPlayers];

    // order users by score & save only the first 100 of them
    players = _.orderBy(players, ['score'], ['desc']);
    players = players.slice(0, 101);

    localStorage.setItem('players', JSON.stringify(players));
    this.setState({ players });
    // const bestPlayer = _.maxBy(players, (item) => item.score);
  };

  preventDoubleClick = (_e) => {
    if (_e) {
      // disable start/stop button
      let btn = _e.target;
      _e.stopPropagation();
      btn.setAttribute('disabled', '');
      setTimeout(() => btn.removeAttribute('disabled'), 1000);
    }

    // disable esc key duriong 1 sec
    this.setState({ escBtnDisabled: true });
    setTimeout(() => this.setState({ escBtnDisabled: false }), 1000);
  };

  checkScoreIntervalIncrement = (fullRows) => {
    const { score, level } = this.state;

    const newScore = incrementScore(fullRows.length, level) + score;
    const intLevel = incrementSpeed(newScore, level);

    //----- testing
    // if (level !== intLevel.level) {
    //   console.log('intLevel: ', intLevel);
    //   console.log(
    //     `%c level up!`,
    //     `color:yellow;
    //     font-size:20px;
    //     padding:20px;
    //     background:black;
    //     border:5px solid tomato;`
    //   );
    //   console.table([`S:${score}`, `L:${level}`, `NL:${intLevel.level}`]);
    // }

    // level up sound
    if (intLevel.level > level) {
      console.table([`Level:${score}`, `NL:${intLevel.level}`]);
      setTimeout(() => this.emitSound('success'), 200);
    }

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
    if (rowsToRemove && rowsToRemove.length) {
      this.checkScoreIntervalIncrement(rowsToRemove);
      // emit sound
      rowsToRemove.length === 4
        ? this.emitSound('clear')
        : this.emitSound('line');
    }
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

        // make sound
        this.emitSound('fall');

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

    this.getPlayersList();

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
        gameOver: true,
      })
    );

    this.tableRef.current.classList.add('disappear');
    this.emitSound('gameover');
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
    // console.log('event: ', _e.keyCode);
    setTimeout(() => {
      this.controlsRef.current.focus();
    }, 1000);

    const {
      paused,
      displayHold,
      displayStartButton,
      escBtnDisabled,
    } = this.state;

    // enter
    if (_e.keyCode === 13 && displayStartButton) return this.startGame();

    // esc
    if (_e.keyCode === 27 && !displayStartButton && !escBtnDisabled)
      return this.stopGame();

    if (!paused) {
      // space
      if (_e.keyCode === 32 || ctrlButton === 'rotate') {
        this.lightedButton('twist');
        return this.rotateFigure();
      }

      // ctrl
      if (_e.keyCode === 17 || ctrlButton === 'hold' || ctrlButton === 'use') {
        this.emitSound('selection');
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

  emitSound = (sound) => {
    this.setState({ sound: sound });
    setTimeout(() => this.setState({ sound: '' }), 10);
  };

  parsedTime = (parsedTime) => {
    this.setState({ time: parsedTime });
  };

  render() {
    let {
      rows,
      cols,
      nextFigure,
      holdedFigure,
      score,
      level,
      players,
      paused,
      displayStartButton,
      pressedButton,
      displayHold,
      sound,
      gameOver,
    } = this.state;

    return (
      <>
        <div className='tetris' ref={this.tableRef}>
          <Music paused={paused} level={level} sound={sound} />
          <div className='widgets'>
            <Display
              title={'time'}
              content={
                <Timer
                  timerType='crono'
                  isPaused={paused}
                  crono={this.parsedTime}
                />
              }
              textAlign={'center'}
            />
            <Display title={'score'} content={score} textAlign={'center'} />
            <Display title={'level'} content={level} textAlign={'center'} />
          </div>
          <div className='board-wrapper'>
            <div
              className='board'
              onKeyDown={this.handleKeyDown}
              tabIndex='0'
              ref={this.controlsRef}
            >
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
        </div>
        {gameOver && <UsersTable players={players} />}
      </>
    );
  }
}

export default Tetris;
