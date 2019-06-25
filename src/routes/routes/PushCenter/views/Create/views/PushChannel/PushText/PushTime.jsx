import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Form,
  Col,
  Row,
  Select,
  TimePicker,
  InputNumber,
  message,
  // Input,
} from 'antd'
import { actions } from '@modules/PushCenter'
import HourRange from './HourRange'
import {
  PUSH_FREQUENCY_TYPE_OPTIONS,
} from '../../../../../configs'

class PushTime extends Component {
  static propTypes = {
    onPeriodTimeChange: T.func.isRequired,
    activatedTab: T.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      periodType: '1',
      pushPoint: '',
      dayType: 0,
      dayWeek: [],
      hourRanges: [],
      pushFrequencyTypeOPtions: PUSH_FREQUENCY_TYPE_OPTIONS.filter(element => true),
    }
  }
  componentDidMount() {
    const {activatedTab} = this.props
    this.triggerChange({ dayType: 0 })
    this.periodTypeItems(activatedTab)
  }
  componentWillReceiveProps(nextProps) {
    const {activatedTab} = nextProps
    this.periodTypeItems(activatedTab)
  }
  periodTypeItems = (activatedTab) => {
    if (activatedTab === '3') {
      this.setState({pushFrequencyTypeOPtions: [PUSH_FREQUENCY_TYPE_OPTIONS[0]]})
    } else {
      this.setState({pushFrequencyTypeOPtions: PUSH_FREQUENCY_TYPE_OPTIONS.filter(element => true)})
    }
  }
  // 每天、每周、每隔**天
  onPeriodTypeChange = (val) => {
    this.setState({ periodType: val })
    if (val === '1') {
      this.setState({ dayType: 0 })
      this.triggerChange({ dayType: 0 })
    } else if (val === '2') {
      this.setState({ dayType: 6 })
      this.triggerChange({ dayType: 6 })
    } else {
      this.setState({ dayType: '' })
      this.triggerChange({ dayType: '' })
    }
  }
  // 每隔 ** 天
  onDayTypeChange = (val) => {
    if (val < 1 || val > 5) {
      message.error('每隔天数为[1, 5]')
      return
    }
    this.setState({ dayType: val })
    this.triggerChange({ dayType: val })
  }
  // 每周 周*周*
  onDayWeekChange = (val) => {
    if (val.length > 2) {
      message.error('最多可选2天')
    }
    this.setState({ dayWeek: val })
    this.triggerChange({ dayWeek: val })
  }

  // hhhmmss
  onPushPointChange = (time, timeString) => {
    this.setState({ pushPoint: timeString.replace(':', '').replace(':', '') })
    this.triggerChange({ pushPoint: timeString.replace(':', '').replace(':', '') })
  }

  // 每日范围
  onHourRangeChange = (hourRanges) => {
    this.setState({hourRanges})
    this.triggerChange({hourRanges})
  }
  // 时间间隔
  gapTimeChange = (val) => {
    this.setState({gapTime: val})
    this.triggerChange({gapTime: val})
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onPeriodTimeChange
    console.log(onChange)
    if (onChange) {
      onChange(changedValue)
    }
  }

  render() {
    const { activatedTab } = this.props
    const { pushFrequencyTypeOPtions } = this.state
    const weeks = [{
      id: 1,
      name: '周一',
    }, {
      id: 2,
      name: '周二',
    }, {
      id: 3,
      name: '周三',
    }, {
      id: 4,
      name: '周四',
    }, {
      id: 5,
      name: '周五',
    }, {
      id: 6,
      name: '周六',
    }, {
      id: 7,
      name: '周日',
    }]
    return (
      <Col>
        <Select
          style={{ width: '25%' }}
          defaultValue="1"
          onChange={this.onPeriodTypeChange}
        >
          {pushFrequencyTypeOPtions.map(cur => 
            (<Select.Option value={cur.id} id={cur.id} key={cur.id}>{cur.name}</Select.Option>),
          )}
        </Select>
        {this.state.periodType === '2'
        && <Select
          mode="multiple"
          placeholder="每周最多选2天"
          style={{ width: '25%', marginLeft: '1em' }}
          onChange={this.onDayWeekChange}
        >
          {weeks.map(cur => (<Select.Option value={cur.id} id={cur.id}>{cur.name}</Select.Option>),
          )}
        </Select>
        }
        {this.state.periodType === '3'
        && <div style={{ display: 'inline-block', width: '25%', textAlign: 'center' }}>
          <span>每隔
            <InputNumber
              min={1}
              max={5}
              style={{ width: '4em', margin: '0 1em' }}
              onChange={this.onDayTypeChange}
            />
          天</span>
        </div>
        }
        {
          activatedTab === '3' && this.state.periodType === '1'
            ? <div>
              <Row><Col span={24}><HourRange onChange={this.onHourRangeChange} /></Col></Row>
              <Row>
                <Col span={4}><label>间隔时间</label></Col>
                <Col span={18}>
                  <div>
                    <InputNumber
                      style={{ width: "15em", marginRight: '1em' }}
                      placeholder="请输入间隔时间"
                      onChange={this.gapTimeChange} />
                    <span style={{ fontSize: '12px' }}>单位：分</span> 
                  </div>
                </Col>
              </Row>
            </div>
            : <TimePicker
              placeholder="请输入PUSH时间"
              style={{ width: '25%', marginLeft: '1em' }}
              onChange={this.onPushPointChange}
              format="HH:mm:ss"
            />
        }
      </Col>
    )
  }
}

export default connect(state => ({
  activatedTab: state.pushCenter.activatedTab,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushTime))

