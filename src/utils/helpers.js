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

// const incrementSpeed = (score) => {
//   let interval = 1000,
//     level = 1;

//   switch (true) {
//     case score >= 53000:
//       interval = 100;
//       level = 18;
//       break;
//     case score >= 50000:
//       interval = 150;
//       level = 17;
//       break;
//     case score >= 45000:
//       interval = 200;
//       level = 16;
//       break;
//     case score >= 42000:
//       interval = 250;
//       level = 15;
//       break;
//     case score >= 39000:
//       interval = 300;
//       level = 14;
//       break;
//     case score >= 36000:
//       interval = 350;
//       level = 13;
//       break;
//     case score >= 33000:
//       interval = 400;
//       level = 12;
//       break;
//     case score >= 30000:
//       interval = 450;
//       level = 11;
//       break;
//     case score >= 27000:
//       interval = 500;
//       level = 10;
//       break;
//     case score >= 24000:
//       interval = 550;
//       level = 9;
//       break;
//     case score >= 21000:
//       interval = 600;
//       level = 8;
//       break;
//     case score >= 18000:
//       interval = 650;
//       level = 7;
//       break;
//     case score >= 15000:
//       interval = 700;
//       level = 6;
//       break;
//     case score >= 12000:
//       interval = 750;
//       level = 5;
//       break;
//     case score >= 9000:
//       interval = 800;
//       level = 4;
//       break;
//     case score >= 6000:
//       interval = 850;
//       level = 3;
//       break;
//     case score >= 3000:
//       interval = 900;
//       level = 2;
//       break;
//     default:
//   }

//   return { interval, level };
// };

const incrementSpeed = (score) => {
  let interval = 1000,
    baseInterval = 1000,
    level = 1;

  for (let i = 1; i < 20; i++) {
    if (score >= 1200 * i) {
      level = i;
      interval = baseInterval - i * 50;
    }
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
