import React from 'react'
import SimpleTime from './components/simpleTimer'
import Board from './components/board'
import './App.scss'

/* Functional Component */
const App = () => {
  return (
    <div className='app'>
      <SimpleTime />
      <Board />
    </div>
  )
}

export default App
