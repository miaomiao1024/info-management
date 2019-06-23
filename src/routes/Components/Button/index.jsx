import React, {
  Component,
} from 'react'
import T from 'prop-types'
import classNames from 'classnames'
import './index.styl'

const prefixCls = 'button-component'
export default class Button extends Component {
  static defaultProps = {
    children: '',
    type: 'nomal',
    htmlType: 'button',
    className: '',
    size: '',
  }
  static propTypes = {
    children: T.node,
    type: T.string,
    htmlType: T.string,
    className: T.string,
    size: T.string,
  }
  render() {
    const {
      children,
      type,
      htmlType,
      className,
      size,
      ...other
    } = this.props
    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${size}`]: size,
    }, className)
    return (
      <button className={classes} type={htmlType} {...other}>
        {children}
      </button>
    )
  }
}
