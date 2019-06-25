// 除了被CouponCreate组件使用之外，还被其它页面使用，调整时请注意

import React, {
  Component,
} from 'react'
import T from 'prop-types'
import {
  Tag,
  // Radio,
  Button,
  Row,
  Col,
  Input,
  Modal,
} from 'antd'
import _ from 'lodash'
import HiddenItems from '@components/HiddenItems'
import { fetch } from '@didi/fate-common'
import { 
  json, 
} from '@didi/fate-common'
import './index.styl'

const { jsonToParams } = json

export default class City extends Component {
  static defaultProps = {
    value: {},
    disabled: false,
    mode: 'multi',
  }
  static propTypes = {
    onChange: T.func.isRequired,
    value: T.array,
    disabled: T.bool,
    bizLine: T.string.isRequired,
    mode: T.string,
  }
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      cityALLChoosedBool: false,
      cityList: [],
      value: props.value || {},
      cities: _.cloneDeep(props.value) || {},
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      value,
    } = nextProps
    if (value) {
      this.setState({
        value,
        cities: value,
      })
    }
  }
  showCityModal = () => {
    // const {
    //   bizLine,
    // } = this.props
    // if (bizLine != '0') {
    //   notification.show({
    //     message: '提示',
    //     description: '请先选择业务线',
    //     bottom: 50,
    //     duration: 3,
    //   })
    //   return
    // }
    this.fetchData()
    this.setState({
      showModal: true,
    })
  }
  fetchData = (search) => {
    // const {
    //   bizLine,
    // } = this.props
    const {
      value,
    } = this.state
    return fetch(`/api/general/city/query?${search
      ? `&${jsonToParams(search)}` : ''}`).then((ret) => {
      const cityList = Object.keys(ret.data).sort().map(key => ({
        letter: key,
        list: ret.data[key],
      }))
      // 判断全选复选框是否需要选中
      let cityALLChoosedBool = !!value // 如果value不存在则
      const values = Object.keys(value)
      cityList.forEach((letter) => {
        letter.list.forEach((item) => {
          if (values.indexOf(item.id) == -1) {
            cityALLChoosedBool = false
          }
        })
      })
      this.setState({
        cityList,
        cityALLChoosedBool,
      })
    })
  }
  chooseCityItemHandler = (city) => {
    let {
      value,
    } = this.state
    const { mode } = this.props
    if (value[`${city.id}`]) {
      delete value[city.id]
      this.setState({
        value,
        cityALLChoosedBool: false,
      })
    } else {
      if (mode == 'single') {
        value = {
          [city.id]: city.name,
        }
      } else {
        value = {
          ...value,
          [city.id]: city.name,
        }
      }

      this.setState({
        value,
      })
    }
  }
  selectAllHandler = () => {
    const {
      cityList,
      cityALLChoosedBool,
    } = this.state
    let {
      value,
    } = this.state
    const bool = !cityALLChoosedBool
    if (bool) {
      cityList.forEach((group) => {
        group.list.forEach((item) => {
          value = {
            ...value,
            [item.id]: item.name,
          }
        })
      })
    } else {
      Object.keys(value).forEach((cur) => {
        cityList.forEach((group) => {
          group.list.forEach((item) => {
            if (item.id == cur) {
              delete value[cur]
            }
          })
        })
      })
    }
    this.setState({
      value,
      cityALLChoosedBool: bool,
    })
  }
  handleConfirm = () => {
    const {
      value,
    } = this.state
    this.setState({
      showModal: false,
      cities: _.cloneDeep(value),
    })
    this.props.onChange(value)
  }
  handleCancel = () => {
    this.setState({
      showModal: false,
    })
  }
  delCityHandler = (id) => {
    const {
      value,
    } = this.state
    delete value[id]
    this.setState({
      value,
      cityALLChoosedBool: false,
    })
  }
  letterScrollToView = (letter) => {
    const letterDom = document.querySelector(`#letter_${letter}`)
    if (letterDom) {
      letterDom.scrollIntoView()
    }
  }
  //搜索城市功能
  handleSearch = (value) => {
    const {
      zone,
    } = this.state
    this.fetchData({
      zone,
      word: value,
    })

    this.setState({
      word: value,
      cityALLChoosedBool: false,
    })
  }
  handleSearchChange = (e) => {
    const {
      zone,
    } = this.state
    const value = e.target.value
    // 搜索词被全部删除时，发送一次请求，不需要用户再手动触发
    if (!value) {
      this.fetchData({
        zone,
        word: value,
      })
    }
    this.setState({
      word: value,
    })
  }
  render() {
    const {
      disabled,
      mode,
    } = this.props
    const {
      showModal,
      cityALLChoosedBool,
      value,
      cities,
      cityList,
    } = this.state
    //console.log(cityList)获取总的适用城市
    return (
      <div className="user-group-city-selector">
        <Button disabled={disabled} onClick={this.showCityModal}>选择城市</Button>
        <HiddenItems
          data={Object.keys(cities).map(cur => ({
            id: cur,
            name: cities[cur],
          }))}
          count={4}
        />
        <Modal
          visible={showModal}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          className="user-group-model"
          cancelText="取消"
          okText="确定"
        >
          <h3 className="dialog-title bg-primary">选择适用城市</h3>
          <div className="container-fluid">
            <div className="row">
              <Input.Search
                placeholder="请输入省份或城市全称"
                onSearch={this.handleSearch}
                onChange={this.handleSearchChange}
                style={{
                  width: 'auto',
                  margin: 15,
                }}
              />
              {mode != 'single' &&
              <div className="checkbox" style={{ marginLeft: '15px' }}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => {}}
                    checked={cityALLChoosedBool}
                    onClick={this.selectAllHandler}
                  />
                    全选
                </label>
              </div>
              }
            </div>
            <Row>
              <Col span={14} className="city-list-all">
                {cityList.map(group => (
                  <dl key={group.id}>
                    <dt id={`letter_${group.letter}`}>{group.letter}</dt>
                    <dd>{
                      group.list.map(city => (
                        <Tag
                          color={`${value[city.id] ? '#108ee9' : ''}`}
                          size="small"
                          onClick={() => { this.chooseCityItemHandler(city) }}
                        >{city.name}</Tag>))}
                    </dd>
                  </dl>))
                }
              </Col>
              <Col span={2} className="letter-index">
                {
                  cityList.map(group =>
                    (<span
                      key={group.id}
                      onClick={() => { this.letterScrollToView(group.letter) }}
                    >
                      {group.letter}
                    </span>))
                }
              </Col>
              <Col span={8}>
                <h6>已选城市 <span className="text-muted">({Object.keys(value).length})</span></h6>
                <div className="city-list-choosed">
                  {
                    Object.keys(value).map(key => (
                      <Tag
                        color="#108ee9"
                        key={key}
                        onClick={() => { this.delCityHandler(key) }}
                      >
                        {value[key]} <span className="close">&times;</span>
                      </Tag>
                    ))
                  }
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }
}

