import React, {
  Component,
} from 'react'
import T from 'prop-types'
import './index.styl'
// import {
//   noop,
// } from '../../utils'

export default class ModuleTitle extends Component {
  static defaultProps = {
    title: '',
    description: '',
    children: '',
    foldable: false,
    // onFold: noop,
    fold: false,
  }
  static propTypes = {
    title: T.string,
    description: T.string,
    children: T.node,
    foldable: T.bool,
    // onFold: T.func,
    fold: T.bool,
  }
  // handleClick = () => {
  //   const {
  //     onFold,
  //   } = this.props
  //   // onFold()
  // }
  render() {
    const {
      children,
      title,
      description,
      foldable,
      fold,
      ...other
    } = this.props
    return (
      <div className="module-title-component" {...other}>
        <h3 className="module-title">
          {
            foldable && <i className={`foldable-icon${fold ? ' fold' : ''}`} />
          }
          {title}
          <span className="description">{description}</span>
        </h3>
        <div className="module-extra">
          {children}
        </div>
      </div>
    )
  }
}
