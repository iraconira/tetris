import React from 'react'
import { PropTypes } from 'prop-types'

const Display = ({ title, content, textAlign }) => {
  const formatContent = () => {
    if (Array.isArray(content))
      return content.map((text) => <div key={String(text)}>{text}</div>)

    return <div>{content}</div>
  }

  return (
    <div className='display'>
      <p className='title' style={{ textAlign: textAlign }}>
        {title}
      </p>
      <div className='content'>{formatContent()}</div>
    </div>
  )
}

Display.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  textAlign: PropTypes.oneOf(['left', 'right']).isRequired,
}

export default Display
