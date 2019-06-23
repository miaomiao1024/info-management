import React, {
  Component,
} from 'react'
import T from 'prop-types'
import {
  Row,
  Col,
} from 'antd'
import Pane from './Pane'
import './index.styl'

export default class Tabs extends Component {
  static propTypes = {
    data: T.array,
    onChange: T.func,
  }
  static defaultProps = {
    activeKey: null,
    data: [],
    onChange: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      activeKey: props.activeKey || (props.data[0] && props.data[0].id),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey) {
      this.setState({ activeKey: nextProps.activeKey })
    }
  }
  onClickHandler=({ key, extra }) => {
    const { onChange } = this.props
    if (key !== this.state.activeKey) {
      this.setState({ activeKey: key })
      onChange({ activeKey: key, extra })
    }
  }
  render() {
    const { activeKey } = this.state
    const { data } = this.props
    const span = Math.floor(data.length === 0 ? 24 : 24 / data.length)
    return (
      <section className="tabs-component" >
        {data.length > 0 &&
        <header>
          <Row gutter={16}>
            {data.length === 1
              ? <div></div>
              : data.map((item, index) =>
                (<Col
                  span={span}
                  key={index}
                  className={item.id === activeKey ? 'item-active' : ''}
                  onClick={() => { this.onClickHandler({ key: item.id, extra: item.extra }) }}
                  style={item.disabled ? { pointerEvents: 'none' } : ''}
                >
                  <div className={item.disabled ? 'col-content-disabled' : 'col-content'}>
                    <h4>{item.name}</h4>
                    <div>{item.desc}</div>
                  </div>
                </Col>),
              )}
          </Row>
        </header>}
      </section>
    )
  }
}

Tabs.Pane = Pane
