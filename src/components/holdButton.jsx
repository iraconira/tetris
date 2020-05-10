import React from 'react';

const HoldButton = ({ displayHold, holdFigure, useHoldedFigure }) => {
  return (
    <>
      {(displayHold && (
        <button className='hold' onClick={holdFigure}>
          hold
        </button>
      )) || (
        <button className='hold' onClick={useHoldedFigure}>
          use
        </button>
      )}
    </>
  );
};

export default HoldButton;
