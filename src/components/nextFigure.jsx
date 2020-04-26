import React, { Component } from 'react'
import Greed from './greed'
import { getFigure } from '../utils/figures'

const NextFigure = ({ nextFigure }) => {
  const generateFigure = (figure, color, position) => {
    let items = []
    const shape = getFigure(figure, position)
    // debugger
    shape.map((coord) => {
      return items.push({
        x: coord[0],
        y: coord[1],
        color,
        figure,
        position,
      })
    })
    return items
  }

  const fillBg = (x, y) => {
    let style = {}

    const setFigureStyle = (figure) => {
      if (figure.x === x && figure.y === y) {
        style.background = figure.color
        style.border = '1px solid black'
        style.borderRadius = '.5em'
        style.boxShadow = '2px 2px 2px grey'
      }
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