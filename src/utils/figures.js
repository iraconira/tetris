const figures = {
  T: {
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
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
}

function getFigure(figure, position = null) {
  return figures[figure][position ? position : 'up']
}

function getCenteredFigure(figure) {
  let selected = figures[figure]['up']
  selected.map((fig) => (fig[0] += 3))
  console.log(selected)
  return selected
}

export { figures, getFigure, getCenteredFigure }
