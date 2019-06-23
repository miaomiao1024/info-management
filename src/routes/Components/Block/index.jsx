// @flow

import React, {
  Component,
  type Node,
} from 'react'
import classNames from 'classnames'
import './index.styl'

declare type Props = {
  type: 'nomal' | 'blue',
  children: Node,
  className?: string,
}
declare type State = {}

export default class Block extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }
  render(): Node {
    const {
      type,
      children,
      className,
      ...other
    } = this.props
    const classes = classNames({
      'block-component': true,
      [`block-component-${type}`]: !!type,
    }, className)
    return (
      <div className={classes} {...other}>
        {children}
      </div>
    )
  }
}
