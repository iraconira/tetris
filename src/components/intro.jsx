import React, { Component } from 'react'

const Intro = ({ user }) => {
  const state = {}

  const handleKeyPress = () => {}

  return (
    <div className='intro'>
      <h1>enter your nickname</h1>
      <input
        className='intro-input'
        type='text'
        onKeyPress={handleKeyPress()}
        value={state.nickname}
        maxLength={12}
      />
      <button className='start-game'>start game</button>
    </div>
  )
}

export default Intro
