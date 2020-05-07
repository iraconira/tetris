import React from 'react';
import Greed from './greed';
import { generateFigure } from '../utils/figures';

const NextFigure = ({ nextFigure }) => {
  const fillBg = (x, y) => {
    let style = {};

    const setFigureStyle = (figure) => {
      if (figure.x === x && figure.y === y) {
        const position = hardcodePosition(figure.figure);
        style.background = figure.color;
        style.border = '0.05rem solid #00000070';
        style.borderRadius = '0.1rem';
        style.position = 'relative';
        style.top = position.top;
        style.left = position.left;
      }
    };

    const hardcodePosition = (figure) => {
      let position = {};
      switch (figure) {
        case 'Z':
        case 'S':
        case 'T':
          position.top = '0.7rem';
          position.left = '0.4rem';
          break;
        case 'J':
          position.top = '0.4rem';
          position.left = '0.7rem';
          break;
        case 'L':
          position.top = '0.4rem';
          position.left = '0.2rem';
          break;
        case 'I':
          position.top = '0';
          position.left = '0.3rem';
          break;
        case 'O':
          position.top = '0.8rem';
          position.left = '0.8rem';
          break;
        default:
        //
      }
      return position;
    };

    let figure = generateFigure(
      nextFigure[0].figure,
      nextFigure[0].color,
      nextFigure[0].position
    );
    figure.forEach((figure) => setFigureStyle(figure));
    return style;
  };

  return (
    <div className='next-figure'>
      <Greed cols={4} rows={4} fillBg={fillBg} />
    </div>
  );
};

export default NextFigure;
