import React, {
  Component,
} from 'react'
import T from 'prop-types'
import classNames from 'classnames'
import {
  Icon, // 选用antd的，有了合适的ICon再删除吧。。UI没给图
} from 'antd'
import './index.styl'
import ModuleTitle from '../ModuleTitle'
import Button from '../Button'
import {
  noop,
} from '@didi/fate-common'

const prefixCls = 'modal-component'

export default class Modal extends Component {
  static defaultProps = {
    children: '',
    className: '',
    visible: false,
    size: '',
    title: '',
    description: '',
    onOk: noop,
    onCancel: noop,
    footer: true,
    okText: '确定',
    cancelText: '取消',
  }
  static propTypes = {
    children: T.node,
    className: T.string,
    size: T.string,
    title: T.string,
    description: T.string,
    visible: T.bool,
    onOk: T.func,
    onCancel: T.func,
    footer: T.oneOfType([
      T.bool,
      T.node,
    ]),
    okText: T.string,
    cancelText: T.string,
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: !!props.visible,
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      visible,
    } = nextProps
    this.setState({
      visible,
    })
  }
  hideModal = () => {
    this.setState({
      visible: false,
    })
  }
  handleMaskClick = () => {
    this.hideModal()
  }
  render() {
    const {
      className,
      children,
      size,
      title,
      description,
      onOk,
      onCancel,
      footer,
      okText,
      cancelText,
      ...other
    } = this.props
    const {
      visible,
    } = this.state
    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-visible`]: visible,
    }, className)
    return (
      <div
        className={classes}
        {...other}
      >
        <div className={`${prefixCls}-mask`} onClick={this.handleMaskClick} />
        <div className={`${prefixCls}-box-wrapper`}>
          <div className={`${prefixCls}-box`}>
            <ModuleTitle className={`${prefixCls}-header`} title={title} description={description} />
            <Icon className="close-btn" type="close" onClick={(onCancel !== noop && onCancel) || this.hideModal} />
            <div className={`${prefixCls}-content`}>
              {children}
            </div>
            {
              footer
              && <div className={`${prefixCls}-footer`}>
                {
                  (typeof footer === 'boolean'
                  && [
                    <Button
                      type="simple"
                      onClick={(onCancel !== noop && onCancel) || this.hideModal}
                    >{cancelText}</Button>,
                    <Button
                      onClick={(onOk !== noop && onOk) || this.hideModal}
                      type="primary"
                    >{okText}</Button>,
                  ])
                  || footer
                }
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
