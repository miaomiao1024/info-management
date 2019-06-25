import React, {
  Component,
} from 'react'
import T from 'prop-types'
import { 
  bindActionCreators 
} from 'redux'
import {
  connect,
} from 'react-redux'
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Radio,
  Upload,
  Icon,
  message,
  notification,
  Modal,
} from 'antd'
import { 
  fetch 
} from '@didi/fate-common'
import {
  PageTitle,
  ModuleTitle,
} from '@components'
import {
// PUSH_BUSINESSES,
  USER_GROUP_ID_TYPE,
  USER_GROUP_ID_TYPE_DRIVER,
  USER_GROUP_USER_ID_TYPE,
  USER_GROUP_USER_ID_TYPE_PID
} from '../../../configs'
import Tabs from './Tabs'
import AddIndicator from './AddIndicators/' //添加指标
import IndicatorsList from './IndicatorsList/' //指标清单
import './index.styl'
import SelectTemplateModel from './SelectTemplateModel'  //选择模版模型
import { actions } from '@modules/CrowdTag'

let detailUserId = '1'
let detailTagType = ''
let detailIdType = ''
const confirm = Modal.confirm;
const Search = Input.Search
const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

class UserGroupCreatorNew extends Component {
  static defaultProps ={
    actions: {},
    category: [],
    currentCategory: 0,
    indicators: [],
  }
  static propTypes = {
    form: T.object.isRequired,
    actions: T.object,
    category: T.array,
    currentCategory: T.number,
    indicators: T.array,
    currentTab: T.string.isRequired,
    // match: T.object.isRequired,
    history: T.object.isRequired,
    createdIndicatorsData: T.object.isRequired,
    estimate: T.object.isRequired,
    idType: T.string.isRequired,
    detail: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      activeTabKey: '1',
      editDisabled: false,
      fileList: [],
      uploadFiles: [],
      createIndicators: [],
      choosedIndicatorsRules: [],
      estimateAmount: '',
      userTagId: '',
      showActivityNameTipModal: false,
      uploadFileName: '还未选择文件',
      loading: false,
      isSelectedFile: false,
    }
    this.subCategoryType = '2'
    props.actions.fetchUserTagCategory({ subCategoryType: this.subCategoryType, idType: USER_GROUP_ID_TYPE_DRIVER })
  }
  //调用触发详情接口
  componentDidMount() {
    const {
      match: { params: { id } },
      actions: { fetchUserTagDetail },
    } = this.props
    if (id) {
      fetchUserTagDetail({ userTagId: id })     
    }
  }
  componentWillReceiveProps(nextProps){
    const {
      actions: { fetchUserTagCategory },
    } = this.props
    if(nextProps.detail.userTagType && 
      (detailTagType != nextProps.detail.userTagType.id || 
      detailIdType != nextProps.detail.userIdType.id))
    {
      detailTagType = nextProps.detail.userTagType.id
      detailIdType = nextProps.detail.userIdType.id
      if(detailTagType == '1'){ var itemNum = '2'}
      if(detailTagType == '3'){ var itemNum = '2,3'}
      const { detail: { userIdType : { id } } } = nextProps 
      fetchUserTagCategory({ subCategoryType: itemNum, idType: id })
    }    
  }
  componentWillUnmount() {
    const { actions: { fetchUserTagEstimate } } = this.props
    fetchUserTagEstimate(null, true)
    detailTagType = ''
    detailIdType = ''
  }
  //指标名称搜索时必须先选择一二级分类
  onSearchHandler = (value, category, subCategoryId, idType) => {
    const {
      actions: { fetchUserTagIndicators, fetchUserTagCategory },
      form: { getFieldValue },
    } = this.props
    const categoryValue = getFieldValue('categoryValue')
    const categoryTem = category || getFieldValue('category')
    const subCategoryTem = subCategoryId || getFieldValue('subCategoryId')
    const idTypeTem = idType || getFieldValue('idType')
    if (!categoryValue && !category && !subCategoryTem) { 
      fetchUserTagCategory({ subCategoryType: this.subCategoryType, idType })
      fetchUserTagIndicators(null, true)
      return 
    }
    if(idType){
      fetchUserTagCategory({ subCategoryType: this.subCategoryType, idType })
    }
    const subCategoryType = this.subCategoryType
    fetchUserTagIndicators({
      metricName: value || categoryValue,
      category: categoryTem,
      subCategoryId: subCategoryTem,
      subCategoryType,
      idType: idTypeTem,
    })
  }
  idTypeChangeHandler = async ({target})=>{
    const {
      actions: { setIdType, setUserTagCreatedIndicators },
      form: { setFieldsValue },
      idType,
      createdIndicatorsData,
    } = this.props
    const _self = this
    setFieldsValue({ category: undefined})
    setFieldsValue({ subCategoryId: undefined})
    if(createdIndicatorsData && 
      createdIndicatorsData.choosedIds && 
      createdIndicatorsData.choosedIds.length > 0 ){
      confirm({
        title: '确认要切换用户类型么？',
        content: '切换用户类型，将清空已选择的筛选条件！',
        onOk() {
          setIdType(target.value)  
          setUserTagCreatedIndicators({
            createdIndicators: [
              { rules: [], logicType: 'and' },
            ],
            groupLogicType: 'and',
            choosedIds: [],
          })     
          _self.onSearchHandler(null, null, null, target.value)
        },
        onCancel() {
          setFieldsValue({ idType})
        },
      });
    }else{
      setIdType(target.value)  
      this.onSearchHandler(null, null, null, target.value)
    }
  }
  getRuleInfo=() => {
    const {
      createdIndicatorsData,
    } = this.props
    const ruleInfo = {}
    const validations = [] 
    ruleInfo.logicType = createdIndicatorsData.groupLogicType
    ruleInfo.items = createdIndicatorsData.createdIndicators.map((item, groupIndex) => {
      if (!item.rules[0]) { return undefined }
      return {
        source: item.rules[0].metricType,
        logicType: item.logicType,
        rules: (item.rules[0].metricType === '3' || item.rules[0].metricType === '5') ?
          (item.rules.map((subItem, indicatorIndex) => {
            let storeOrCityValue
            let mark
            const {
              storeType,
              citys,
              metricNameZh,
              storeId,
              detailStores,
              metricDescription,
              bizLine,
              metricId,
              metricName,
              symbol,
              symbolType,
              metricValue,
              valueType,
              storeTypes,
            } = subItem
            if (storeType === '2' && citys) {
              storeOrCityValue = Object.keys(citys)[0]
              mark = JSON.stringify(citys)
            } else {
              storeOrCityValue = storeId
              mark = JSON.stringify(detailStores)
            }
            if (!storeOrCityValue) {
              validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，控件不能为空`)
            }
            if (!subItem.metricValue) {
              validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，值不能为空`)
            }
            return {
              logicType: 'and',
              rules: [
                {
                  id: 9999, // 随便搞的
                  name: 'dimension_id',
                  symbol: '7',
                  symbolType: storeType === '2' ? '3' : '4',
                  value: storeOrCityValue,
                  alias: metricNameZh,
                  description: metricDescription,
                  valueType: 1,
                  bizLine,
                  mark,
                },
                {
                  id: metricId,
                  name: metricName,
                  symbol: (symbol).toString(),
                  symbolType,
                  value: metricValue,
                  alias: metricNameZh,
                  description: metricDescription,
                  valueType,
                  bizLine,
                  mark,
                },
                {
                  id: 9999,
                  name: 'dimension_type',
                  symbol: '1',
                  symbolType: storeType === '2' ? '3' : '4',
                  value: storeType,
                  alias: metricNameZh,
                  description: metricDescription,
                  valueType: '2',
                  bizLine,
                  mark: JSON.stringify(storeTypes),
                },
              ],
            }
          })) :
          (item.rules.map((subItem, indicatorIndex) => {
            let mark
            const {
              detailStores,
              metricValue,
              symbolType,
              metricType,
              metricId,
              metricName,
              metricNameZh,
              metricDescription,
              logicType,
              valueType,
              bizLine,
            } = subItem
            let {
              value,
            } = subItem
            if(!Array.isArray(metricValue)){
              value = metricValue
            }
            
            if (subItem.citys) {
              value = Object.keys(subItem.citys).join(',')
              mark = JSON.stringify(subItem.citys)
              subItem.symbol = '7'
            }
            
            let enumValues
            if (metricType === '2' || metricType === '6' || metricType === '4') {
              if(!Array.isArray(metricValue)){
                value = metricValue // 默认给这个值
              } else {
                enumValues = metricValue
                if (!subItem.metricValueSelect 
                  && !(enumValues && enumValues.length>0 
                  && enumValues.some(({id})=> id == value))) {
                  validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，枚举不能为空`)
                }
              }

              if (subItem.metricValueSelect) {
                value = subItem.metricValueSelect
                enumValues = metricValue
              }
            }
            if (symbolType === '7') { // 常驻地
              if (detailStores) {
                mark = JSON.stringify(detailStores)
              } else {
                validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，门店不能为空`)
              }
              if (!metricValue) {
                validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，值不能为空`)
              }
            }else{ 
              if (typeof value === 'undefined' || value === null) {
                validations.push(`第${groupIndex + 1}组中第${indicatorIndex + 1}个指标，值不能为空`)
              }
            }
            const symbolNum = subItem.symbol
            return {
              id: metricId,
              name: metricName,
              symbol:symbolNum,
              symbolType,
              alias: metricNameZh,
              description: metricDescription,
              logicType,
              source: metricType,
              valueType,
              bizLine,
              enumValues,
              value,
              mark,
            }
          })),
      }
    })
    return { ruleInfo, validations }
  }
  estimateAmountHandler = () => {
    const { 
      actions: { 
        fetchUserTagEstimate
      }, 
      form:{
        getFieldValue
      } 
    } = this.props
    const { ruleInfo, validations = [] } = this.getRuleInfo()
    if (ruleInfo.items.length == 1 && !ruleInfo.items[0]) {
      message.error('目前无指标')
      return
    }
    if (validations.length > 0) {
      message.error(validations[0])
      return
    }
    if (ruleInfo.items.length == 0) {
      message.error('目前无指标')
      return
    }
    //console.log(ruleInfo)
    fetchUserTagEstimate({
      idType: getFieldValue('idType'),
      ruleInfo: JSON.stringify(ruleInfo),
    })
  }
  //生成人群标签功能
  handleSubmit = (isTemplate) => {
    const {
      form,
      history,
    } = this.props
    const {
      match: { params: { id } },
    } = this.props
    const {
      activeTabKey,
    } = this.state
    const reg = /^(\d+,?)*\d$/
    if (activeTabKey == '1') {
      form.validateFieldsAndScroll(['name', 'ruleType', 'idType', 'amount',
        'isAddWhiteList','isAddBlackList','blackList', 'whiteList', 'tagId'], (err, values) => {
        //console.log('form values:', values, err)
        if (err) return
        if (values.whiteList && !(reg.test(values.whiteList))) {
          message.info('白名单首末位必须是大于零的数字，ID之间用逗号(,)隔开')
          return
        }
        /* if (values.isAddWhiteList && !values.whiteList) {
          message.info('白名单不能为空')
          return
        }
        if (values.isAddBlackList && !values.blackList) {
          message.info('黑名单不能为空')
          return
        } */
        if (values.blackList && !(reg.test(values.blackList))) {
          message.info('黑名单首末位必须是大于零的数字，ID之间用逗号(,)隔开')
          return
        }
        if (values.amount && (values.amount < 0 || values.amount > 10000000)) {
          message.info('投放数量不在0～10000000范围')
          return
        }
        values.type = activeTabKey // 类型（1-离线圈选、2-上传文件、3-实时指标）
        values.isTemplate = isTemplate // 是否为模板（1-保存为模板，2-生成人群标签）
        // 整理ruleInfo字段
        const { ruleInfo, validations = [] } = this.getRuleInfo()
        if (ruleInfo.items.length == 1 && !ruleInfo.items[0]) {
          message.error('目前无指标')
          return
        }
        if (ruleInfo.items.length == 0) {
          message.error('目前无指标')
          return
        }
        if (validations.length > 0) {
          message.error(validations[0])
          return
        }
        values.ruleInfo = JSON.stringify(ruleInfo)
        const keys = Object.keys(values)
        keys.forEach((key) => {
          if (values[key] == undefined) delete values[key]
        })
        if(id){
          values.tagId = id
        }
        fetch('/api/user-tag/create', {
          method: 'post',
          data: JSON.stringify(values),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res && res.status == 10000) {
            if(id){
              message.info('编辑成功')
            }else{
              message.info('创建成功')
            }
            
            if (isTemplate == 2) {
              history.push('/customer/tag')
            }
          }
          console.info(res)
        })     
      })
    } else if (activeTabKey == '2') {
      form.validateFieldsAndScroll(['name', 'userIdType', 'uploadFile','tagId','saveType'], (err, values) => {
        if (err) return
        const { userTagId } = this.state
        if (this.state.userTagId == '') {
          message.error('未上传文件')
          return
        }
        values.type = activeTabKey // 类型（1-离线圈选、2-上传文件、3-实时指标）
        delete values.uploadFile
        if(!id){
          values.saveType = '1'
          values.tagId = userTagId
        }else{
          values.saveType = '2'
          values.tagId = id
        }
        fetch('/api/user-tag/generate', {
          method: 'post',
          data: JSON.stringify(values),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res && res.status == 10000) {
            if(id){
              message.info('编辑成功')
            }else{
              message.info('创建成功')
            }
            history.push('/customer/tag')
          }
          console.info(res)
        })
      })
    } else if (activeTabKey == '3') {
      form.validateFieldsAndScroll([
        'name', 'idType', 'isAddWhiteList','blackList','isAddBlackList', 'whiteList','tagId'
      ], (err, values) => {
        if (err) return
        if (values.whiteList && !(reg.test(values.whiteList))) {
          message.info('白名单首末位必须是大于零的数字，ID之间用逗号(,)隔开')
          return
        }
        /* if (values.isAddWhiteList && !values.whiteList) {
          message.info('白名单不能为空')
          return
        }
        if (values.isAddBlackList && !values.blackList) {
          message.info('黑名单不能为空')
          return
        } */
        if (values.blackList && !(reg.test(values.blackList))) {
          message.info('黑名单首末位必须是大于零的数字，ID之间用逗号(,)隔开')
          return
        }
        values.type = activeTabKey // 类型（1-离线圈选、2-上传文件、3-实时指标）
        values.isTemplate = isTemplate // 是否为模板（1-保存为模板，2-生成人群标签）
        // 整理ruleInfo字段
        const { ruleInfo, validations = [] } = this.getRuleInfo()
        if (ruleInfo.items.length == 1 && !ruleInfo.items[0]) {
          message.error('目前无指标')
          return
        }
        if (ruleInfo.items.length == 0) {
          message.error('目前无指标')
          return
        }
        if (validations.length > 0) {
          message.error(validations[0])
          return
        }
        values.ruleInfo = JSON.stringify(ruleInfo)
        const keys = Object.keys(values)
        keys.forEach((key) => {
          if (values[key] == undefined) delete values[key]
        })
        if(id){
          values.tagId = id
        }
        fetch('/api/user-tag/create', {
          method: 'post',
          data: JSON.stringify(values),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res && res.status == 10000) {
            if(id){
              message.info('编辑成功')
            }else{
              message.info('创建成功')
            }
            if (isTemplate == 2) {
              history.push('/customer/tag')
            }
          }
          console.info(res)
        })       
      })
    }
  }

  beforeUpload =(file) => {
    const { size } = file
    const fileSize = size / (1024 * 1024)
    if (fileSize > 30) {
      message.error('文件大小不能超过30M')
      return false
    }else{
      return true
    }
  }
  deleteFile = () => {
    this.setState({ uploadFileName: '还未选择文件', isSelectedFile: false, userTagId: '' })
  }
  activeTabOnChangeHandler =({ activeKey, extra }) => {
    const {
      actions: { fetchUserTagCategory, fetchUserTagIndicators, setCurrentTab, setUserTagCreatedIndicators },
      form: { setFieldsValue },
    } = this.props
    this.setState({ activeTabKey: activeKey })
    fetchUserTagCategory(null, true)
    this.subCategoryType = extra.subCategoryType
    // const idType = getFieldValue('idType')
    fetchUserTagCategory({ subCategoryType: extra.subCategoryType, idType:USER_GROUP_ID_TYPE_DRIVER })
    fetchUserTagIndicators(null, true)
    setCurrentTab(activeKey)
    setUserTagCreatedIndicators({
      createdIndicators: [
        { rules: [], logicType: 'and' },
      ],
      groupLogicType: 'and',
      choosedIds: [],
    })
    setFieldsValue({ idType: USER_GROUP_ID_TYPE_DRIVER })
    setFieldsValue({ subCategoryId: undefined })
    setFieldsValue({ category: undefined })
  }
  render() {  
    const {
      match: { params: { id } },
      form: {
        getFieldDecorator,
        setFieldsValue,
        getFieldValue,
      },
      actions: { selectUserTagCategoryItem },
      currentCategory,
      indicators: { data: indicatorList },
      estimate: {
        data: { estimateAmount },
        isFetching: estimateIsFetching,
      },
      currentTab,
      detail,
    } = this.props
    if(id && (detail.userTagType) && (detail.userTagType.id != this.state.activeTabKey)){
      this.setState({activeTabKey:detail.userTagType.id})
    }
    if(id && detail.userIdType){
      detailUserId = detail.userIdType.id
    }
    let { category: { data: categoryList = [] } } = this.props
    const {
      activeTabKey,
      createIndicators,
      choosedIndicatorsRules,
      showActivityNameTipModal,
    } = this.state
    categoryList = categoryList || []
    // catagory 一级数据
    const pcategory = categoryList.map(item => item.category)
    const { subCategoryList } = categoryList.find((item) => {
      if (item.category.id == currentCategory) {
        return true
      }
      return false
    }) || {}
    const data = [
      {
        title: '人群圈选（非实时数据）',
        desc: '拖动圈选条件到右侧条件框，点击左下角按钮估算所选条件的用户数量，点击生成人群标签，人群可供PUSH和线上用户校验使用。如无特殊说明，各指标均计算T-1的数据。',
        key: '1',
        extra: { subCategoryType: '2' },
      },
      {
        title: '用户校验（含实时数据）',
        desc: '拖动校验条件到右侧条件框，生成人群校验标签，支持实时和非实时指标的混合圈选。人群校验标签可供各业务线的各类活动调用，实现线上实时或非实时的用户校验。',
        key: '3',
        extra: { subCategoryType: '2,3' },
      },
      {
        title: '文件上传',
        desc: `支持上传txt、csv格式的文本文件。同一人群包中包含多个用户ID的，不自动去重。文件中只能包含用户ID，文件上传更多支持临时需求，请运营尽量使用指标进行人群圈选。`,
        key: '2',
        extra: { subCategoryType: '1' },
      },
    ]
    const basicFormItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    }
    const whiteAndBlockLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    }
    const uploadProps = {
      action: '/api/user-tag/upload',
      onChange: (info) => {
        const file = info.file
        if (file.status == 'uploading' && this.state.loading == false) {
          this.setState({ loading: true })
        }
        if (file.status == 'done') {
          if (file.response && file.response.status == 10000) {
            notification.success({
              message: `${file.name}上传成功`,
            })
            this.setState({userTagId:file.response.data.uploadFileId,uploadFileName:file.name,isSelectedFile:true})
            //message.success(`${file.name}上传成功`)
          } else {
            //message.error(file.response.msg)
            notification.error({
              message: `${file.name}上传失败`,
              description: file.response.msg,
            })
          }
          this.setState({ loading: false })
        } else if (info.file.status == 'error') {
          this.setState({ loading: false })
          //message.error(`${file.name}上传失败`)
          notification.error({
            message: `${file.name}上传失败`,
          })
        }
      },
    }
    const uploadPropsEdit = {
      action: `/api/user-tag/upload?id=${id}`,
      onChange: (info) => {
        const file = info.file
        if (file.status == 'uploading' && this.state.loading == false) {
          this.setState({ loading: true })
        }
        if (file.status == 'done') {
          if (file.response && file.response.status == 10000) {
            notification.success({
              message: `${file.name}上传成功`,
            })
            this.setState({userTagId:file.response.data.uploadFileId,uploadFileName:file.name,isSelectedFile:true})
            //message.success(`${file.name}上传成功`)
          } else {
            //message.error(file.response.msg)
            notification.error({
              message: `${file.name}上传失败`,
              description: file.response.msg,
            })
          }
          this.setState({ loading: false })
        } else if (info.file.status == 'error') {
          this.setState({ loading: false })
          //message.error(`${file.name}上传失败`)
          notification.error({
            message: `${file.name}上传失败`,
          })
        }
      },
    }   
    return (
      <div className="user-group-create-page">
        {!id && 
        <PageTitle
          titles={['圈人定投', '新建人群标签']}
        />}
        {id && 
        <PageTitle
          titles={['圈人定投', '编辑人群标签']}
        />}
        <Form>
          <Tabs
            activeKey={activeTabKey}
            data={data}
            onChange={({ activeKey, extra }) => this.activeTabOnChangeHandler({ activeKey, extra })}
            editChoseKey={(id && `${detail.userTagName}`)}
          />
          <section>
            <ModuleTitle
              title="设置基本信息"
            />
            <div className="basic-info-container">
              {
                <Form.Item
                  {...basicFormItemLayout}
                  label="人群标签名称"
                  extra={
                    <p>
                      <span
                        style={{
                          color: '#2976FB',
                          cursor: 'pointer',
                        }}
                        onClick={() => { this.setState({ showActivityNameTipModal: true }) }}
                      >命名规范</span>
                    </p>
                  }
                >
                  {getFieldDecorator('name', {
                    initialValue: (data.bizLine && `${data.bizLine}`) || 
                                  (id && detail.userTagName && `${detail.userTagName}`), 
                    rules: [{
                      required: true,
                      message: '输入标签名称',
                    }, {
                      max: 50,
                      message: '标签名称不能超过50个字符',
                    },
                    {
                      pattern: /^([\u4e00-\u9fa5]|[A-Za-z])[\u4e00-\u9fa5\w\-()（）]*$/,
                      message: '标签名字必须以汉字或字母开头,只能包含数字、英文字母、汉字、下划线、中划线 、中英文括号',
                    }],
                  })(
                    <Input
                      placeholder="请输入后台标识用人群标签名称，不超过50个汉字"
                    />,
                  )}
                </Form.Item>
              }
              {activeTabKey == '1' && 
              <Form.Item
                {...basicFormItemLayout}
                label="投放数量"
              >
                {getFieldDecorator('amount', {
                  initialValue: data.amount && `${data.amount}`,
                })(
                  <Input
                    type="number"
                    placeholder="请输入用户数量，1-10000000之间整数数字"
                  />,
                )}
              </Form.Item>}
              {activeTabKey == '2' && !id &&
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 15 }}
                label="上传文件"
              >
                {getFieldDecorator('uploadFile', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '请上传文件',
                  }],
                })(
                  <div>
                    <Upload
                      className="upload"
                      accept="text/csv,text/plain"
                      {...uploadProps}
                      defaultFileList={this.state.uploadFiles}
                      beforeUpload={this.beforeUpload}
                      showUploadList={false}
                    >
                      <Button>
                        <Icon type="upload" /> 上传文件
                      </Button>
                      <span onClick={e => e.stopPropagation()}>
                      仅支持30M以内的txt、csv文件</span>
                      <span 
                        className="crowd-file-upload-tip"
                        onClick={e=> e.stopPropagation()}
                      >
                      (人群作为线上校验时只保留15天，用作PUSH时不受15天限制)
                      </span>
                    </Upload>
                    <div style={{ marginLeft: '.5em' }}>{this.state.loading
                      ? <Icon type="loading" theme="outlined" />
                      : <span title={this.state.uploadFileName}>
                        {this.state.isSelectedFile
                        && <Icon type="paper-clip" />
                        }
                        <span style={{ marginRight: '4em', marginLeft: '4px' }}>{this.state.uploadFileName}</span>
                        {this.state.isSelectedFile
                        && <Icon type="close" style={{ cursor: 'pointer' }} onClick={this.deleteFile} title="删除" />
                        }
                      </span>
                    }
                    </div>
                  </div>
                  ,
                )}
              </Form.Item>}
              {activeTabKey == '2' && id &&
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 15 }}
                label="上传文件"
              >
                {getFieldDecorator('uploadFile', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '请上传文件',
                  }],
                })(
                  <div>
                    <Upload
                      className="upload"
                      accept="text/csv,text/plain"
                      {...uploadPropsEdit}
                      defaultFileList={this.state.uploadFiles}
                      beforeUpload={this.beforeUpload}
                      showUploadList={false}
                    >
                      <Button>
                        <Icon type="upload" /> 上传文件
                      </Button>
                      <span onClick={e => e.stopPropagation()}>
                      仅支持30M以内的txt、csv文件</span>
                      <span 
                        className="crowd-file-upload-tip"
                        onClick={e=> e.stopPropagation()}
                      >
                      (人群作为线上校验时只保留15天，用作PUSH时不受15天限制)
                      </span>
                    </Upload>
                    <div style={{ marginLeft: '.5em' }}>{this.state.loading
                      ? <Icon type="loading" theme="outlined" />
                      : <span title={this.state.uploadFileName}>
                        {this.state.isSelectedFile
                        && <Icon type="paper-clip" />
                        }
                        <span style={{ marginRight: '4em', marginLeft: '4px' }}>{this.state.uploadFileName}</span>
                        {this.state.isSelectedFile
                        && <Icon type="close" style={{ cursor: 'pointer' }} onClick={this.deleteFile} title="删除" />
                        }
                      </span>
                    }
                    </div>
                  </div>
                  ,
                )}
              </Form.Item>}
              {(activeTabKey == '2') &&  !id  &&
              <Form.Item
                {...basicFormItemLayout}
                label="用户ID类型"
              >
                {getFieldDecorator('userIdType', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                  initialValue: USER_GROUP_USER_ID_TYPE_PID,
                })(
                  <Radio.Group
                    onChange={this.idTypeChangeHandler}
                  >
                    {
                      USER_GROUP_USER_ID_TYPE.map(cur => (
                        <Radio key={cur.id} value={cur.id}>
                          {cur.name}
                        </Radio>
                      ))
                    }
                  </Radio.Group>,
                )}
              </Form.Item>
              }
              {(activeTabKey == '2') &&  id  &&
              <Form.Item
                {...basicFormItemLayout}
                label="用户ID类型"
              >
                {getFieldDecorator('userIdType', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                  initialValue: detailUserId,
                })(
                  <Radio.Group>
                    {
                      USER_GROUP_USER_ID_TYPE.map(cur => (
                        <Radio key={cur.id} value={cur.id} disabled>
                          {cur.name}
                        </Radio>
                      ))
                    }
                  </Radio.Group>,
                )}
              </Form.Item>
              }
              {(activeTabKey == '1' || activeTabKey == '3') && id &&
              <Form.Item
                {...basicFormItemLayout}
                label="用户类型"
              >
                {getFieldDecorator('idType', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                  initialValue: detailUserId,
                })(
                  <Radio.Group>
                    {
                      USER_GROUP_ID_TYPE.filter(({ id })=>{
                        if(activeTabKey === '1' && id === '4'){
                          return false
                        }else{
                          return true
                        }
                      }).map(cur => (
                        <Radio key={cur.id} value={cur.id} disabled>
                          {cur.name}
                        </Radio>
                      ))
                    }
                  </Radio.Group>,
                )}
              </Form.Item>
              }
              {(activeTabKey == '1' || activeTabKey == '3') && !id &&
              <Form.Item
                {...basicFormItemLayout}
                label="用户类型"
              >
                {getFieldDecorator('idType', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                  initialValue: USER_GROUP_ID_TYPE_DRIVER,
                })(
                  <Radio.Group
                    onChange={this.idTypeChangeHandler}
                  >
                    {
                      USER_GROUP_ID_TYPE.filter(({ id })=>{
                        if(activeTabKey === '1' && id === '4'){
                          return false
                        }else{
                          return true
                        }
                      }).map(cur => (
                        <Radio key={cur.id} value={cur.id}>
                          {cur.name}
                        </Radio>
                      ))
                    }
                  </Radio.Group>,
                )}
              </Form.Item>
              }
            </div>
          </section>
          {(activeTabKey == '1' || activeTabKey == '3') && <section>
            <ModuleTitle
              title="选择数据指标"
            />
            <div className="indicator-container">
              <Row gutter={8}>
                <Col span={8} className="indicator-left-container">
                  <div className="ant-form-item-label">
                    <label htmlFor="name" className="ant-form-item-required" title="筛选指标">筛选指标</label>
                  </div>
                  <div id="dragContainer" className="source-indicator-container">
                    <Form.Item>
                      {getFieldDecorator('categoryValue', {
                        initialValue: '',
                      })(
                        <Search
                          placeholder="指标名称搜索"
                          onSearch={value => this.onSearchHandler(value)}
                          enterButton
                        />,
                      )}
                    </Form.Item>
                    <Row>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="">
                          {getFieldDecorator('category')(
                            <Select
                              allowClear
                              placeholder="指标一级分类"
                              onChange={(value) => {
                                selectUserTagCategoryItem(value || 0)
                                const cur = categoryList.find(categoryListItem =>
                                  categoryListItem.category.id === value)
                                if (cur) {
                                  setFieldsValue({ subCategoryId: cur.subCategoryList[0] &&
                                    cur.subCategoryList[0].id })
                                  this.onSearchHandler(undefined, value, (cur.subCategoryList[0] &&
                                    cur.subCategoryList[0].id) || 0)
                                } else {
                                  setFieldsValue({ subCategoryId: '' })
                                }
                              }}
                            >
                              {
                                pcategory.map(cur => (
                                  <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                                ))
                              }
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="">
                          {getFieldDecorator('subCategoryId')(
                            <Select
                              allowClear
                              placeholder="指标二级分类"
                              onChange={(value) => {
                                this.onSearchHandler(undefined, undefined, value || 0)
                              }}
                            >
                              {
                                subCategoryList && subCategoryList.map(cur => (
                                  <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                                ))
                              }
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="indicators-list-container">
                      <IndicatorsList
                        data={indicatorList}
                        choosedIds={getFieldValue('indicators') && getFieldValue('indicators').choosedIds}
                      />
                    </div>
                  </div>
                </Col>
                <Col span={16} className="indicator-right-container">
                  <div className="ant-form-item-label">
                    <label htmlFor="name" className="ant-form-item-required" title="添加条件">添加条件</label>
                  </div>
                  <Form.Item>
                    {getFieldDecorator('indicators', {
                      initialValue: {
                        createdIndicators: createIndicators,
                        choosedIds: choosedIndicatorsRules,
                      },

                    })(
                      <AddIndicator
                        data={getFieldValue('indicators')}
                        curentEditMsg={(id && `${detail.ruleInfo}`)}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div className="white-list-container">
                {/*  <Form.Item >
                  {getFieldDecorator('isAddWhiteList', {
                    initialValue: false,
                  })(
                    <Checkbox
                      checked={getFieldValue('isAddWhiteList')}
                    >
                      添加白名单</Checkbox>,
                  )}
                </Form.Item> */}
                <Form.Item 
                  {...whiteAndBlockLayout}
                  label="添加白名单"
                >
                  {getFieldDecorator('whiteList', {
                    initialValue: (id && detail.whiteList && `${detail.whiteList}`) || '',
                  })(
                    <Input size="default" placeholder="请输入白名单用户ID，多个ID以逗号隔开" />,
                  )}
                </Form.Item>
              </div>

              <div className="white-list-container">
                {/* <Form.Item >
                  {getFieldDecorator('isAddBlackList', {
                    initialValue: false,
                  })(
                    <Checkbox
                      checked={getFieldValue('isAddBlackList')}
                    >
                      添加黑名单</Checkbox>,
                  )}
                </Form.Item> */}
                <Form.Item 
                  {...whiteAndBlockLayout}
                  label="添加黑名单"
                >
                  {getFieldDecorator('blackList', {
                    initialValue: (id && detail.blackList && `${detail.blackList}`) || '',
                  })(
                    <Input size="default" placeholder="请输入黑名单用户ID，多个ID以逗号隔开" />,
                  )}
                </Form.Item>
              </div>
              {activeTabKey == '1' && <div className="caculate-container">
                <Button
                  onClick={this.estimateAmountHandler}
                  type="primary"
                  size="default"
                  disabled={estimateIsFetching}
                >
                  {estimateIsFetching ? '估算中' : '估算用户数'}
                </Button>
                <span>实际数量以生成为准</span>
                <span>{estimateAmount}</span>
              </div>}
            </div>
          </section>}
          <section className="operator-container">
            <div>
              { (activeTabKey == '1' || activeTabKey == '3') && (currentTab == '1' || currentTab == '3')
              &&
              <Button
                onClick={() => { this.handleSubmit(1) }}
                size="default"
              >保存为模版</Button>
              }
              <Button
                size="default"
                onClick={() => {
                  const {
                    history,
                  } = this.props
                  history.push('/customer/tag')
                }}
              >取消</Button>
              { (activeTabKey == '1' || activeTabKey == '2') &&
              <Button
                onClick={() => { this.handleSubmit(2) }}
                type="primary"
                size="default"
              >{id  && "更新人群标签"}{!id && "生成人群标签"}</Button>}
              { (activeTabKey == '3') &&
              <Button
                onClick={() => { this.handleSubmit(2) }}
                type="primary"
                size="default"
              >{id  && "更新校验标签"}{!id && "生成校验标签"}</Button>}
            </div>
          </section>
        </Form>
        <SelectTemplateModel />
        <Modal className="lbs-push-create-activity-name-modal" control={false} isOpen={showActivityNameTipModal}>
          <h3 className="dialog-title bg-primary" style={{ textAlign: 'center' }}>人群标签命名规范</h3>
          <div style={{ padding: '10px 30px' }}>
            <p style={{ color: '#2976FB', marginBottom: '10px', fontSize: 24 }}>请按照区域-活动名称-时间进行命名</p>
            <p>如：</p>
            <p>北京-首页弹窗资源位投放-6月</p>
          </div>
          <div className="dialog-controls">
            <Button
              size="default"
              onClick={() => { this.setState({ showActivityNameTipModal: false }) }}
            >
              我知道了
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(
  state => ({
    category: state.crowdTag.category,
    currentCategory: state.crowdTag.currentCategory,
    indicators: state.crowdTag.indicators,
    createdIndicatorsData: state.crowdTag.createdIndicatorsData,//拿到的拖拽后的数据
    templateModelVisable: state.crowdTag.templateModelVisable,
    estimate: state.crowdTag.estimate,
    currentTab: state.crowdTag.currentTab,
    uploadFilelist: state.crowdTag.uploadFilelist,
    idType: state.crowdTag.idType,
    detail: state.crowdTag.detail.data,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(Form.create()(UserGroupCreatorNew))
