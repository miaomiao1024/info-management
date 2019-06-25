import React, {
  Component,
} from 'react'
import T from 'prop-types'
import {
  connect,
} from 'react-redux'
import {
  Button,
  Modal,
  notification,
} from 'antd'
import _ from 'lodash'
import HiddenItems from '@components/HiddenItems'
import Store from '@components/Store'
import { fetch } from '@didi/fate-common'
import {
  getValueByKey,
} from '@components/Lib/tool.fn'
import {
  PUSH_BUSINESSES,
  PUSH_BUSINESS_JIA_YOU,
} from '../../../configs'
import './index.styl'

class Section extends Component {
  static defaultProps = {
    value: [],
    disabled: false,
    disabledAll: false,
    bizLine: '',
  }
  static propTypes = {
    onChange: T.func.isRequired,
    value: T.array,
    disabled: T.bool,
    bizLine: T.string,
    form: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      storeALLChoosedBool: false,
      value: props.value || {},
      chooseItem: null,
      choosedItem: null,
      store: _.cloneDeep(props.value) || {},
      popSugList: [],
      storeSugList: [],
      popInit: false,
      storeInit: false,
      pop: '',
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      value,
    } = nextProps
    if (value) {
      this.setState({
        store: value,
        value,
      })
    }
  }
  //这个是什么函数？
  getStoreListHandler = () => {
    const {
      pop,
    } = this.state
    const {
      form: { getFieldValue },
    } = this.props
    const bizLine = getFieldValue('bizLine')
    if (!bizLine) {
      notification.show({
        message: '提示',
        description: '请先选择业务线',
        bottom: 50,
        duration: 3,
      })
      return
    }
    fetch(`/api/general/store/list2?popId=${pop}&bizLine=${bizLine}`).then((ret) => {
      if (ret.status === 10000) {
        this.setState({
          storeInit: true,
          storeALLChoosedBool: false,
          storeSugList: (ret && ret.data && ret.data) || [],
        }, () => {
        })
      }
    })
  }
  //指标拖拽到右侧区域后触发
  choosePopHander = (id) => {
    this.setState({
      pop: id,
    }, () => {
      this.getStoreListHandler()
    })
  }

  //暂时不知道干什么用的？？？？
  selectAllHandler = () => {
    const {
      storeSugList,
      storeALLChoosedBool,
    } = this.state
    let {
      value,
    } = this.state
    const bool = !storeALLChoosedBool
    if (bool) {
      storeSugList.forEach((item) => {
        value = {
          ...value,
          [item.storeId]: item.storeName,
        }
      })
    } else {
      Object.keys(value).forEach((cur) => {
        delete value[cur]
      })
    }
    this.setState({
      value,
      storeALLChoosedBool: bool,
    })
  }
  
  //模态框--确认
  handleConfirm = () => {
    this.setState({ showModal: false, choosedItem: this.state.chooseItem })
    const { storeId, cityId, storeName, latitude, longitude } = this.state.chooseItem
    this.props.onChange({ storeId, cityId, storeName, latitude, longitude })
  }
  //模态框--取消
  handleCancel = () => {
    this.setState({
      showModal: false,
    })
  }
  //选中打开模态框
  showSelectBizModal = () => {
    this.setState({
      showModal: true,
    })
  }
  //接收store传来的数据
  handleChangeBizLine = (item) => {
    const {itemValue:{value , bizLine}  } = item
    if(!value) return
    if(!bizLine) return 
    fetch(`/api/general/store/list?word=${value}&bizLine=${bizLine}`).then((ret) => {
      if (ret.status === 10000) {
        this.setState({
          storeInit: true,
          storeALLChoosedBool: false,
          storeSugList: getValueByKey(ret, 'data') || [],
        }, () => {
        })
      }
    })
  }
  //提交的参数
  handleValue = (value) => {
    const { itemValue : { chooseItem } } = value
    console.log(chooseItem)
    this.setState({ chooseItem: chooseItem })
  }
  render() {
    const {
      disabled,
    } = this.props
    const {
      showModal,
      storeSugList,
      value,
    } = this.state
    return (
      <div className="user-group-biz-selector">
        <Button disabled={disabled} onClick={this.showSelectBizModal}>选择门店</Button>
        {value && <HiddenItems
          data={[{ id: value.storeId, name: value.storeName }]}
          count={4}
        />}
        <Modal
          visible={showModal}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          className="user-group-model"
        >
          <h3>选择适用门店</h3>
          <Store 
            initialValue={PUSH_BUSINESS_JIA_YOU}
            selectBizLine={PUSH_BUSINESSES}
            onChange={this.handleChangeBizLine}
            storeSugList = {storeSugList}
            storeInit = {this.state.storeInit}
            onClick = {this.handleValue}
          />
          
        </Modal>
      </div>
    )
  }
}

export default connect()(Section)
