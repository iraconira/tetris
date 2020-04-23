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

function twistFigure(currentFigure) {
  const figUnit = currentFigure[0]
  const shapeUnit = figures[figUnit.figure][figUnit.position][0]

  // console.log(currentFigure)

  let rotate = 'up'
  switch (figUnit.position) {
    case 'up':
      rotate = 'right'
      break
    case 'right':
      rotate = 'down'
      break
    case 'down':
      rotate = 'left'
      break
    case 'left':
      rotate = 'up'
      break
    default:
    //
  }

  // console.log('rotate > ', rotate)

  let diff = {}
  if (figUnit.x > shapeUnit[0]) {
    diff.x = figUnit.x - shapeUnit[0]
    diff.y = figUnit.y - shapeUnit[1]
  } else {
    diff.x = figUnit.x + shapeUnit[0]
    diff.y = figUnit.y + shapeUnit[1]
  }

  // console.log('diff > ', diff)

  const twistedFigure = getFigure(figUnit.figure, rotate)

  const finalFigure = []
  twistedFigure.forEach((coords) => {
    let piece = {
      x: coords[0] + diff.x,
      y: coords[1] + diff.y,
      color: figUnit.color,
      figure: figUnit.figure,
      position: rotate,
    }
    finalFigure.push(piece)
  })

  // console.log(twistedFigure)
  return finalFigure

  // figUnit.x - figures[figUnit.figure][figUnit.position]
}

export { figures, getFigure, getCenteredFigure, twistFigure }
