import {
  sso
} from '@didi/fate-common'
import cookie from 'js-cookie'

const { toLogin } = sso
export const PUSH_TOOL_BUSINESS_REFUEL = '159'
export const PUSH_TOOL_BUSINESS_MAINTAIN = '187'
export const PUSH_TOOL_BUSINESS_CAR_LIFE = '201'
//export const PUSH_TOOL_BUSINESS_SHARE_CAR = '202'
export const PUSH_TOOL_BUSINESS_ONLINE_RENT = '203'
export const PUSH_TOOL_BUSINESS_PLATFORM = '204'
//export const PUSH_BUSINESS_CAR_NEW_RETAIL = '205'
export const PUSH_BUSINESS_RECHARGE = '250'
export const PUSH_BUSINESS_RENTAL_NEW = '330'
// 业务线ID（159-小桔加油/187-小桔养车/201-滴滴车生活/202-滴滴共享汽车/203-网约车租售/204-平台治理）
export const PUSH_TOOL_BUSINESSES_MAP = {
  [PUSH_TOOL_BUSINESS_REFUEL]: '小桔加油',
  [PUSH_TOOL_BUSINESS_MAINTAIN]: '小桔养车',
  [PUSH_TOOL_BUSINESS_CAR_LIFE]: '小桔车服',
  [PUSH_BUSINESS_RENTAL_NEW] : '小桔短租',
  //[PUSH_TOOL_BUSINESS_SHARE_CAR]: '滴滴共享汽车',
  [PUSH_TOOL_BUSINESS_ONLINE_RENT]: '网约车自营',
  [PUSH_TOOL_BUSINESS_PLATFORM]: '小桔租车',
  //[PUSH_BUSINESS_CAR_NEW_RETAIL]: '汽车新零售',
  [PUSH_BUSINESS_RECHARGE]: '小桔充电'
}

export const PUSH_TOOL_BUSINESSES = Object.keys(PUSH_TOOL_BUSINESSES_MAP).map(cur => ({
  id: cur,
  name: PUSH_TOOL_BUSINESSES_MAP[cur],
  disabled: false,
}))

// -------------------
export const PUSH_STATUS_DAI_SHEN_HE = '6'
export const PUSH_STATUS_DAI_SHENG_XIAO = '8'
export const PUSH_STATUS_SHEN_HE_BO_HUI = '7'
export const PUSH_STATUS_SHENG_XIAO_ZHONG = '2'
export const PUSH_STATUS_YI_XIA_XIAN = '1'
export const PUSH_STATUS_YI_GUO_QI = '9'
export const PUSH_STATUS_YI_WAN_CHENG = '5'
export const PUSH_STATUS_DIAO_DU_ZHONG = '4'

// 活动状态(1-未生效/已下线，2-生效中/上线，3-删除，4-调度中，
//   5-已完成，6-待审核，7-审核驳回，8-待生效，9-已过期)
export const PUSH_CENTER_STATUS_MAP = {
  [PUSH_STATUS_DAI_SHEN_HE]: '待审核',
  [PUSH_STATUS_DAI_SHENG_XIAO]: '待生效',
  [PUSH_STATUS_SHEN_HE_BO_HUI]: '审核驳回',
  [PUSH_STATUS_SHENG_XIAO_ZHONG]: '生效中',
  [PUSH_STATUS_YI_XIA_XIAN]: '已下线',
  [PUSH_STATUS_YI_GUO_QI]: '已过期',
  [PUSH_STATUS_YI_WAN_CHENG]: '已完成',
  [PUSH_STATUS_DIAO_DU_ZHONG]: '调度中',
}
export const PUSH_CENTER_STATUS_OPTIONS = Object.keys(PUSH_CENTER_STATUS_MAP).map(cur => ({
  id: cur,
  name: PUSH_CENTER_STATUS_MAP[cur],
}))

// ---------------------
export const PUSH_CHANNEL_PUSH_DRIVER = '1'
export const PUSH_CHANNEL_PUSH_PASSENGER = '2'
export const PUSH_CHANNEL_BROADCAST = '3'
export const PUSH_CHANNEL_MESSAGE = '4'
export const PUSH_CHANNEL_COUPON = '5'
export const PUSH_CHANNEL_PUSH_XIAOJU = '6'
export const PUSH_CHANNEL_MESSAGE_PASSENGER = '8'
export const PUSH_CHANNEL_PUSH_QUANYI = '9'


export const PUSH_CHANNEL_MAP = {
  [PUSH_CHANNEL_MESSAGE_PASSENGER]:'乘客端消息号',
  [PUSH_CHANNEL_PUSH_DRIVER]: '司机端PUSH',
  [PUSH_CHANNEL_PUSH_PASSENGER]: '乘客端PUSH',
  [PUSH_CHANNEL_BROADCAST]: '司机端播报',
  [PUSH_CHANNEL_MESSAGE]: '短信',
  [PUSH_CHANNEL_COUPON]: '优惠券',
  [PUSH_CHANNEL_PUSH_XIAOJU]: '小桔车服端外PUSH',
  [PUSH_CHANNEL_PUSH_QUANYI]: '权益',
}

export const PUSH_CHANNEL_OPTIONS = Object.keys(PUSH_CHANNEL_MAP).map(cur => ({
  id: cur,
  name: PUSH_CHANNEL_MAP[cur],
  disabled: false,
}))

// ---------------------
export const PUSH_PERIOD_TYPE_ONCE = '2'
export const PUSH_PERIOD_TYPE_PERIOD = '3'

export const PUSH_PERIOD_TYPE_MAP = {
  [PUSH_PERIOD_TYPE_ONCE]: '单次推送',
  [PUSH_PERIOD_TYPE_PERIOD]: '周期自动推送',
}
export const PUSH_PERIOD_TYPE_OPTIONS = Object.keys(PUSH_PERIOD_TYPE_MAP).map(cur => ({
  id: cur,
  name: PUSH_PERIOD_TYPE_MAP[cur],
  disabled: false,
}))

// ---------------------
export const PUSH_MESSAGE_TYPE_TEXT = '1'
export const PUSH_MESSAGE_TYPE_PICTURN = '2'

export const PUSH_MESSAGE_TYPE_MAP = {
  [PUSH_MESSAGE_TYPE_TEXT]: '文本',
  [PUSH_MESSAGE_TYPE_PICTURN]: '图文',
}
export const PUSH_MESSAGE_TYPE_OPTIONS = Object.keys(PUSH_MESSAGE_TYPE_MAP).map(cur => ({
  id: cur,
  name: PUSH_MESSAGE_TYPE_MAP[cur],
  disabled: false,
}))

// --------------------
export const PUSH_TOOL_RULE_COMMON = '1'
export const PUSH_TOOL_RULE_OIL_STREAM = '2'
export const PUSH_TOOL_RULE_LBS = '3'
export const PUSH_TOOL_RULE_UNCOMMON = '4'

export const PUSH_TOOL_RULE_MAP = {
  [PUSH_TOOL_RULE_COMMON]: {
    name: '普通',
    value: '1',
    disabled: false,
    desc: `支持对选定的人群包做单次和周期推送，每次可投放多个通道；
    建议选择同一个端上的多个通道做投放，如同时选择车主端PUSH和车主端播报。`,
  },
  /* [PUSH_TOOL_RULE_OIL_STREAM]: {
    name: '油站导流',
    value: '2',
    disabled: false,
    desc: `支持上传油站列表后对满足条件的用户做定向投放；
    用于对列表油站进行导流、扶持或分流。`,
    role: 'push_gas_diversion',
  },  */
  [PUSH_TOOL_RULE_LBS]: {
    name: 'LBS投放',
    value: '3',
    disabled: false,
    desc: `支持对到达选定商户一定范围内的用户做定向投放；
    基于LBS投放更精准，搭配优惠券使用收益更高。`,
    role: 'push_lbs_role',
  },
  /* [PUSH_TOOL_RULE_UNCOMMON]: {
    name: '交叉营销',
    value: '4',
    disabled: false,
    desc: `支持对多个通道选定不同人群包做单次和周期推送，
    进行多个通道的交叉营销。
    `,
    role: 'push_cross_marketing',
  } */
}

let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

let PUSH_TOOL_RULE1 = Object.keys(PUSH_TOOL_RULE_MAP).map(cur => ({
  id: cur,
  ...PUSH_TOOL_RULE_MAP[cur],
}))
// if (user.roleList && !user.roleList.some(item => item === 'push_gas_diversion')) {
//   PUSH_TOOL_RULE1 = PUSH_TOOL_RULE1.filter(item =>
//     window.Number.parseInt(item.value) !== window.Number.parseInt(PUSH_TOOL_RULE_OIL_STREAM))
// }
if (user.roleList) {
  PUSH_TOOL_RULE1 = PUSH_TOOL_RULE1.filter(item => {
    if (!item.role) {
      return true
    } else {
      return user.roleList.indexOf(item.role) >= 0
    }
  })
}

export const PUSH_TOOL_RULE = PUSH_TOOL_RULE1
//详情页中显示详情有油站导流 和 交叉营销 需要单独陪字段
// -------------------
export const PUSH_TOOL_RULE_DETAIL_MAP = {
  [PUSH_TOOL_RULE_COMMON]: {
    name: '普通',
    value: '1',
    disabled: false,
    desc: `支持对选定的人群包做单次和周期推送，每次可投放多个通道；
    建议选择同一个端上的多个通道做投放，如同时选择车主端PUSH和车主端播报。`,
  },
  [PUSH_TOOL_RULE_OIL_STREAM]: {
    name: '油站导流',
    value: '2',
    disabled: false,
    desc: `支持上传油站列表后对满足条件的用户做定向投放；
    用于对列表油站进行导流、扶持或分流。`,
    
  }, 
  [PUSH_TOOL_RULE_LBS]: {
    name: 'LBS投放',
    value: '3',
    disabled: false,
    desc: `支持对到达选定商户一定范围内的用户做定向投放；
    基于LBS投放更精准，搭配优惠券使用收益更高。`,
   
  },
  [PUSH_TOOL_RULE_UNCOMMON]: {
    name: '交叉营销',
    value: '4',
    disabled: false,
    desc: `支持对多个通道选定不同人群包做单次和周期推送，
    进行多个通道的交叉营销。
    `,
  }
}









// ---------------------------
export const PUSH_TOOL_ROLE_PASSENGER = '1'
export const PUSH_TOOL_ROLE_OIL_SPECIAL_QUICK = '2'
// 业务线ID（159-小桔加油/187-小桔养车/201-滴滴车生活/202-滴滴共享汽车/203-网约车租售/204-平台治理）
export const PUSH_TOOL_ROLE_MAP = {
  [PUSH_TOOL_ROLE_PASSENGER]: {
    name: '顺风车司机',
    value: '1',
    checked: true,
  },
  [PUSH_TOOL_ROLE_OIL_SPECIAL_QUICK]: {
    name: '专快',
    value: '2',
    checked: true,
  },
}

export const PUSH_TOOL_ROLE = Object.keys(PUSH_TOOL_ROLE_MAP).map(cur => ({
  id: cur,
  ...PUSH_TOOL_ROLE_MAP[cur],
}))

// ---------------------
export const PUSH_TOOL_LOCATION_RULE_3KM = '3'
export const PUSH_TOOL_LOCATION_RULE_5KM = '5'
export const PUSH_TOOL_LOCATION_RULE_10KM = '10'
export const PUSH_TOOL_LOCATION_RULE_MAP = {
  [PUSH_TOOL_LOCATION_RULE_3KM]: '3km',
  [PUSH_TOOL_LOCATION_RULE_5KM]: '5km',
  [PUSH_TOOL_LOCATION_RULE_10KM]: '10km',
}

export const PUSH_TOOL_LOCATION_RULE = Object.keys(PUSH_TOOL_LOCATION_RULE_MAP).map(cur => ({
  id: cur,
  name: PUSH_TOOL_LOCATION_RULE_MAP[cur],
  disabled: false,
}))

// ---------------------
// 在coupon目录下有重复第一，后续使用这里的定义，逐渐淘汰coupon目录中的定义
/* export const BUSINESS_JIA_YOU = '159'
export const BUSINESS_WEI_BAO = '187'
export const BUSINESS_SHOU_JI_CHONG_ZHI = '179'

export const BUSINESSES_MAP = {
  [BUSINESS_JIA_YOU]: '加油',
  [BUSINESS_WEI_BAO]: '维保',
  [BUSINESS_SHOU_JI_CHONG_ZHI]: '手机充值',
}

export const BUSINESSES = Object.keys(BUSINESSES_MAP).map(cur => ({
  id: cur,
  name: BUSINESSES_MAP[cur],
})) */


// ---------------------
// 在coupon目录下有重复第一，后续使用这里的定义，逐渐淘汰coupon目录中的定义
export const BUSINESS_GAS = '159'
export const BUSINESS_MAINTENANCE = '187'
export const BUSINESS_RECHARGE = '250'
export const BUSINESS_SHARE_TIME = '373'
export const BUSINESS_RENTAL_NEW = '330'
export const BUSINESS_AM_MEMBER = '326'
//export const BUSINESS_RENATAL_NEW = ''

export const BUSINESSES_MAP = {
  [BUSINESS_GAS]: '小桔加油',
  [BUSINESS_MAINTENANCE]: '小桔养车',
  [BUSINESS_RECHARGE]: '小桔充电',
  [BUSINESS_SHARE_TIME]: '分时租赁',
  [BUSINESS_RENTAL_NEW]: '短租',
  [BUSINESS_AM_MEMBER]: '车服平台会员',
}

export const BUSINESSES = Object.keys(BUSINESSES_MAP).map(cur => ({
  id: cur,
  name: BUSINESSES_MAP[cur],
}))





// -----------------------
export const CROWD_TAG_OFFLINE_DATA_TAG_CHOOSE = '1'
export const CROWD_TAG_REAL_TIME_TAG_CHOOSE = '3'
export const CROWD_TAG_CROWD_FILE_UPLOAD = '2'

export const pushTagType = {
  [CROWD_TAG_OFFLINE_DATA_TAG_CHOOSE]: '指标圈选',
  [CROWD_TAG_REAL_TIME_TAG_CHOOSE]: '实时指标',
  [CROWD_TAG_CROWD_FILE_UPLOAD]: '上传文件',
}

export const CROWD_TAG_TYPE_OPTIONS = Object.keys(pushTagType).map(cur => ({
  id: cur,
  name: pushTagType[cur],
}))

// -----------------------
export const CROWD_TAG_REAL_TIME_TAG_CHOOSE_TWO = '3'
export const pushTagTypeTow = {
  [CROWD_TAG_REAL_TIME_TAG_CHOOSE_TWO]: '实时指标',
}
export const CROWD_TAG_TYPE_OPTIONS_TWO = Object.keys(pushTagTypeTow).map(cur => ({
  id: cur,
  name: pushTagType[cur],
}))

// --------------
export const PUSH_FREQUENCY_TYPE_EVERYDAY = '1'
export const PUSH_FREQUENCY_TYPE_EVERYWEEK = '2'
export const PUSH_FREQUENCY_TYPE_EVERYFEWDAYS = '3'

export const PUSH_FREQUENCY_TYPE_MAP = {
  [PUSH_FREQUENCY_TYPE_EVERYDAY]: '每日',
  [PUSH_FREQUENCY_TYPE_EVERYWEEK]: '每周',
  [PUSH_FREQUENCY_TYPE_EVERYFEWDAYS]: '每隔几天',
}

export const PUSH_FREQUENCY_TYPE_OPTIONS = Object.keys(PUSH_FREQUENCY_TYPE_MAP).map(cur => ({
  id: cur,
  name: PUSH_FREQUENCY_TYPE_MAP[cur],
}))

// ---------------------
