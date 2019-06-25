import React from 'react'
import T from 'prop-types'
import './index.styl'

const TitleNav = ({ title }) => (
  <div className="title-container">
    <div className="circle" />
    <span>{title}</span>
  </div>
)
TitleNav.propTypes = {
  title: T.string.isRequired,
}
export default TitleNav
