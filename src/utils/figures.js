const figures = {
  Z: {
    color: 'red',
    up: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    right: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    down: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    left: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  },
  S: {
    color: 'yellow',
    up: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    right: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    down: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    left: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  },
  J: {
    color: 'green',
    up: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    right: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    down: [
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
    left: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
  },
  T: {
    color: 'blue',
    up: [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    right: [
      [1, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    down: [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    left: [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  },
  L: {
    color: 'orange',
    up: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    right: [
      [0, 1],
      [1, 1],
      [0, 2],
      [2, 1],
    ],
    down: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    left: [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  I: {
    color: 'pink',
    up: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    right: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    down: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    left: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
  },
  O: {
    color: 'gray',
    up: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    right: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    down: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    left: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
};

function getFigure(figure, position = null) {
  return figures[figure][position ? position : 'up'];
}

function getRandomFigure(cols) {
  // create array from figures
  let figuresArray = [];
  for (const item in figures) {
    figuresArray.push([item, figures[item].color]);
  }

  const randomFigure =
    figuresArray[Math.floor(Math.random() * figuresArray.length)];
  const randomPosition = ['up', 'right', 'down', 'left'][
    Math.floor(Math.random() * ['up', 'right', 'down', 'left'].length)
  ];

  randomFigure.push(randomPosition);

  let items = [];
  const figure = getFigure(randomFigure[0]);

  figure.forEach((coord) => {
    items.push({
      // x: coord[0],
      x: coord[0] + cols / 2 - 2,
      y: coord[1],
      figure: randomFigure[0],
      color: randomFigure[1],
      position: 'up',
    });
  });
  return items;
}

const generateFigure = (figure, color, position) => {
  let items = [];
  const shape = getFigure(figure, position);
  // debugger
  shape.map((coord) => {
    return items.push({
      x: coord[0],
      y: coord[1],
      color,
      figure,
      position,
    });
  });
  return items;
};

function twistFigure(currentFigure) {
  const figUnit = currentFigure[0];
  const shapeUnit = figures[figUnit.figure][figUnit.position][0];

  // console.log('TWIST: currentFigure > ', currentFigure)

  let rotate = 'up';
  switch (figUnit.position) {
    case 'up':
      rotate = 'right';
      break;
    case 'right':
      rotate = 'down';
      break;
    case 'down':
      rotate = 'left';
      break;
    case 'left':
      rotate = 'up';
      break;
    default:
    //
  }

  const twistedFigure = getFigure(figUnit.figure, rotate);

  const finalFigure = [];
  // debugger
  twistedFigure.forEach((coords) => {
    let piece = {
      x: coords[0] + (figUnit.x - shapeUnit[0]),
      y: coords[1] + (figUnit.y - shapeUnit[1]),
      color: figUnit.color,
      figure: figUnit.figure,
      position: rotate,
    };
    finalFigure.push(piece);
  });
  // console.log('TWIST: twistedFigure > ', finalFigure)
  return finalFigure;
}

export { figures, getFigure, getRandomFigure, generateFigure, twistFigure };
