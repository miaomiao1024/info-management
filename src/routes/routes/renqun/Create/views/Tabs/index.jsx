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
let editStyleDisable = false
export default class Tabs extends Component {
  static propTypes = {
    // children: T.element.isRequired,
    activeKey: T.string,
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
      activeKey: props.activeKey || null,
    }
  }
  componentWillUnmount(){
    editStyleDisable = false
  }
  componentWillReceiveProps(nextProps) {
    const { editChoseKey } = nextProps
    if (nextProps.activeKey) {
      this.setState({ activeKey: nextProps.activeKey })
    }
    if(editChoseKey){
      editStyleDisable = true
    }
  }
  onClickHandler=({ key, extra }) => {
    const { onChange } = this.props
    if (key != this.state.activeKey) {
      this.setState({ activeKey: key })
      onChange({ activeKey: key, extra })
    }
  }
  render() {
    const { activeKey } = this.state
    const { data } = this.props
    //const {}
    const span = Math.floor(data.length == 0 ? 24 : 24 / data.length)
    return (
      <section className="tabs-component" >
        {data.length > 0 &&
        <header>
          <Row gutter={16}>
            {!editStyleDisable && data.map((item, index) =>(
              <Col
                span={span}
                className={(data[index] && data[index].key) == activeKey ? 'item-active' : ''}
                onClick={() => { this.onClickHandler({ key: data[index].key, extra: data[index].extra }) }}
                style={item.disabled ? { pointerEvents: 'none' } : ''}
              >
                <div className={item.disabled ? 'col-content-disabled' : 'col-content'}>
                  <h4>{item.title}</h4>
                  <div>{item.desc}</div>
                </div>
              </Col>
            ),
            )}
            {editStyleDisable && data.map((item, index) =>(
              <Col
                span={span}
                className={(data[index] && data[index].key) == activeKey ? 'item-active' : 'item-disabled'}
                onClick={() => { this.onClickHandler({ key: data[index].key, extra: data[index].extra }) }}
                style={item.disabled ? { pointerEvents: 'none' } : ''}
              >
                <div className={item.disabled ? 'col-content-disabled' : 'col-content'}>
                  <h4>{item.title}</h4>
                  <div>{item.desc}</div>
                </div>
              </Col>
            ),
            )}
          </Row>
        </header>}
        {/* <div>
          {children.map((item, index) => {
            if (activeKey == null && index == 0) {
              return <div style={{ display: 'block' }}>{item}</div>
            }
            if (activeKey == item.key) {
              return <div style={{ display: 'block' }}>{item}</div>
            }
            return null
          })}
        </div> */}
      </section>
    )
  }
}

Tabs.Pane = Pane
