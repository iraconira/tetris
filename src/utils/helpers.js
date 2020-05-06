const incrementScore = (rows) => {
  let score = 10;
  switch (rows) {
    case 1:
      break;
    case 2:
      score *= 2;
      break;
    case 3:
      score *= 4;
      break;
    case 4:
      score *= 10;
      break;
    default:
  }

  return score;
};

const incrementSpeed = (score) => {
  let interval = 1000,
    level = 1;

  switch (true) {
    case score >= 500:
      interval = 100;
      level = 8;
      break;
    case score >= 450:
      interval = 200;
      level = 7;
      break;
    case score >= 400:
      interval = 300;
      level = 6;
      break;
    case score >= 350:
      interval = 400;
      level = 5;
      break;
    case score >= 200:
      interval = 500;
      level = 4;
      break;
    case score >= 150:
      interval = 600;
      level = 3;
      break;
    case score >= 100:
      interval = 700;
      level = 2;
      break;
    case score >= 50:
      interval = 800;
      level = 1;
      break;
    default:
  }

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
