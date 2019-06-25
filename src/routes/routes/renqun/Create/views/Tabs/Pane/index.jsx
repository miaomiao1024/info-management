import React from 'react'
import T from 'prop-types'

export default function Pane({ children }) {
  return (
    <div>{children}</div>
  )
}

Pane.propTypes = {
  children: T.element.isRequired,
}

