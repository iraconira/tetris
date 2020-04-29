import React from 'react'
import Greed from './greed'
import { generateFigure } from '../utils/figures'

const NextFigure = ({ nextFigure }) => {
  const fillBg = (x, y) => {
    let style = {}

    const setFigureStyle = (figure) => {
      if (figure.x === x && figure.y === y) {
        const position = hardcodePosition(figure.figure)
        style.background = figure.color
        style.border = '1px solid black'
        style.borderRadius = '4px'
        style.boxShadow = '2px 2px 2px grey'
        style.position = 'relative'
        style.top = position.top
        style.left = position.left
      }
    }

    const hardcodePosition = (figure) => {
      let position = {}
      switch (figure) {
        case 'Z':
        case 'S':
        case 'T':
          position.top = '18px'
          position.left = '10px'
          break
        case 'J':
          position.top = '8px'
          position.left = '16px'
          break
        case 'L':
          position.top = '8px'
          position.left = '4px'
          break
        case 'I':
          position.top = '0px'
          position.left = '10px'
          break
        case 'O':
          position.top = '18px'
          position.left = '18px'
          break
        default:
        //
      }
      return position
    }

    let figure = generateFigure(
      nextFigure[0].figure,
      nextFigure[0].color,
      nextFigure[0].position
    )
    figure.forEach((figure) => setFigureStyle(figure))
    return style
  }

  return (
    <div className='next-figure'>
      <Greed cols={4} rows={4} fillBg={fillBg} />
    </div>
  )
}

export default NextFigure
