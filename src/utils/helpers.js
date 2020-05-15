const incrementScore = (rows, level) => {
  let score = 0;
  switch (rows) {
    case 1:
      score = 40;
      break;
    case 2:
      score = 100;
      break;
    case 3:
      score = 300;
      break;
    case 4:
      score = 1200;
      break;
    default:
  }

  return score * level;
};

const incrementSpeed = (score, level) => {
  let interval = 1000,
    levelUp = 1200 * 2 * level;

  if (score >= levelUp) {
    level++;
  }
  interval = interval - level * 50;

  return { interval, level };
};

const removeFilledRows = (board, cols, matchings) => {
  matchings.forEach((rowToDelete) => {
    if (rowToDelete && rowToDelete.length === cols) {
      rowToDelete.forEach((match) => {
        board.forEach((item) => {
          if (item.x === match[0] && item.y === match[1]) {
            board.splice(board.indexOf(item), 1);
          }
        });
      });
    }

    board.forEach((item) => {
      if (item.y < rowToDelete[0][1]) {
        item.y++;
      }
    });
  });

  return board;
};

const getFilledRows = (board, rows, cols) => {
  let emptyArray = Array.from(Array(rows).keys());
  let allRows = emptyArray.map((row) => []);

  // generate all rows
  board.forEach((hub) => {
    allRows.forEach((row, index) => {
      if (index === hub.y) {
        allRows[index].push([hub.x, hub.y]);
      }
    });
  });

  return allRows.filter((row) => row.length === cols);
};

const detectCollisions = (board, cols, rows, movedFigure) => {
  let collision = false;

  board.forEach((boardUnit) => {
    movedFigure.forEach((figUnit) => {
      if (
        (boardUnit.x === figUnit.x && boardUnit.y === figUnit.y) ||
        figUnit.x < 0 ||
        figUnit.x > cols - 1 ||
        figUnit.y > rows - 1
      ) {
        // console.log('collision!! ', [figUnit.x, figUnit.y])
        collision = true;
      }
    });
  });

  return collision;
};

export {
  incrementScore,
  incrementSpeed,
  removeFilledRows,
  getFilledRows,
  detectCollisions,
};
