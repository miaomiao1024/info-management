import React from 'react'
import T from 'prop-types'
import './index.styl'

export default function Bubble({ num }) {
  return (
    <span className="bubble-component">
      <span>{Number(num) > 99 ? '99+' : num}</span>
    </span>)
}

Bubble.propTypes = {
  num: T.string.isRequired,
}
