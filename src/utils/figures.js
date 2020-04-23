const figures = {
  T: {
    up: [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    down: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    left: [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    right: [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
  },
  L: {
    up: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    right: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ],
    down: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    left: [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  },
}

function getFigure(figure, position = null) {
  return figures[figure][position ? position : 'up']
}

export { figures, getFigure }
