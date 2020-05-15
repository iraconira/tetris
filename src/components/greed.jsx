import React from 'react'

const Grred = ({ rows, cols, fillBg }) => {
  const rowsArray = Array.from(new Array(rows).keys())
  const colArray = Array.from(new Array(cols).keys())
  return (
    <React.Fragment>
      {rowsArray.map((row, y) => (
        <div key={String(row + y)} className='row'>
          {colArray.map((col, x) => (
            <div
              key={String(col + x)}
              className='hub'
              // className={'hub ' + this.setClass(x, y)}
              x={x}
              y={y}
              style={fillBg(x, y)}
            >
              {/* {x},{y} */}
            </div>
          ))}
        </div>
      ))}
    </React.Fragment>
  )
}

export default Grred
