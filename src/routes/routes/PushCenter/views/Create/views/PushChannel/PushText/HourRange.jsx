import React, { Component } from 'react'
import T from 'prop-types'
import {
  TimePicker,
  Icon,
  Row,
  Col,
  message,
} from 'antd'
// import moment from 'moment'

export default class HourRange extends Component {
    static propTypes = {
      onChange: T.func.isRequired,
    }
    constructor(props) {
      super(props)
      this.state = {
        hourRanges: [{
          startHour: '',
          endHour: '',
        }],
      }
    }
  plusItem = () => {
    const {hourRanges} = this.state
    if (hourRanges.length === 3) {
      message.error("最多选择三组时间")
      return
    } else {
      hourRanges.push({
        startHour: '',
        endHour: '',
      })
      this.setState({hourRanges})
    }
  }
  minusItem = (index) => {
    const {hourRanges} = this.state
    hourRanges.splice(index, 1)
    this.setState({hourRanges})
  }
  timeChange = ({startHour, endHour, index}) => {
    const hourRanges = this.state.hourRanges
    if (startHour !== undefined) {
      if (hourRanges[index].endHour && startHour >= hourRanges[index].endHour) {
        message.error("开始时间必须小于结束时间")
        return
      }
      hourRanges[index] = {startHour, endHour: hourRanges[index].endHour}
    } else if (endHour !== undefined) {
      // toDate().getHours()
      console.log(endHour.toDate().getHours())
      if (endHour.toDate().getHours() !== 0) {
        if (hourRanges[index].startHour && endHour <= hourRanges[index].startHour) {
          message.error("结束时间必须大于开始时间")
          return
        }
      }
      hourRanges[index] = {startHour: hourRanges[index].startHour, endHour}
    }
    this.setState({ hourRanges })
    this.props.onChange(hourRanges)
  }
  render() {
    const format = "HH"
    const { hourRanges } = this.state
    return (
      <div>
        <Row>
          {hourRanges.map((item, index) => (
            <Col offset={4} key={index}>
              <TimePicker
                format={format}
                value={item.startHour}
                onChange={(time) => {this.timeChange({startHour: time, index})}} />&nbsp;&nbsp;-&nbsp;&nbsp;
              <TimePicker
                format={format}
                value={item.endHour}
                onChange={(time) => {this.timeChange({endHour: time, index})}} />&nbsp;&nbsp;
              {index === (hourRanges.length - 1)
                ? <Icon
                  type="plus-circle-o"
                  style={{ color: '#2976FB', fontSize: '1.2em', verticalAlign: 'middle' }}
                  onClick={this.plusItem} />
                : <Icon
                  type="minus-square"
                  style={{ color: '#2976FB', fontSize: '1.2em', verticalAlign: 'middle' }}
                  onClick={() => {this.minusItem(index)}} />
              }  
            </Col>
          ))}
        </Row>
      </div>

    )
  }
}