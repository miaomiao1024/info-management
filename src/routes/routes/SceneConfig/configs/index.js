//用户类型  1-司机 2-乘客
export const SCENE_CONFIG_USER_TYPE_DRIVER = '1'
export const SCENE_CONFIG_USER_TYPE_PASSENGER = '2'
export const SCENE_CONFIG_USER_TYPE_MAP = {
  [SCENE_CONFIG_USER_TYPE_DRIVER]: {
    name: '司机',
    value: '1',
    checked: true,
  },
  [SCENE_CONFIG_USER_TYPE_PASSENGER]: {
    name: '乘客',
    value: '2',
    checked: false,
  },
}

export const SCENE_CONFIG_USER_TYPE = Object.keys(SCENE_CONFIG_USER_TYPE_MAP).map(cur => ({
  id: cur,
  ...SCENE_CONFIG_USER_TYPE_MAP[cur],
}))


//场景范围  1-指定区域 2-自定义区域 3-指定商户
export const SCENE_CONFIG_SCENE_RANGE_SPECIFIC_AREA = '1'
export const SCENE_CONFIG_SCENE_RANGE_CUSTOM_AREA = '2'
export const SCENE_CONFIG_SCENE_RANGE_DESIGNAED_MERCHANT = '3'
export const SCENE_CONFIG_SCENE_RANGE_MAP = {
  [SCENE_CONFIG_SCENE_RANGE_SPECIFIC_AREA]: {
    name: '指定区域',
    value: '1',
    checked: true,
  },
  [SCENE_CONFIG_SCENE_RANGE_CUSTOM_AREA]: {
    name: '自定义区域',
    value: '2',
    checked: false,
  },
  [SCENE_CONFIG_SCENE_RANGE_DESIGNAED_MERCHANT]: {
    name: '指定商户',
    value: '3',
    checked: false,
  },
}

export const SCENE_CONFIG_SCENE_RANGE = Object.keys(SCENE_CONFIG_SCENE_RANGE_MAP).map(cur => ({
  id: cur,
  ...SCENE_CONFIG_SCENE_RANGE_MAP[cur],
}))

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


//场景配置状态  1-待生效，2-生效中，3-下线，4-已过期，5-已删除
export const SCENE_CONFIG_STATUS_TO_BE_EFFECTIVE = '1'
export const SCENE_CONFIG_STATUS_IN_EFFECT = '2'
export const SCENE_CONFIG_STATUS_DOWNLINE = '3'
export const SCENE_CONFIG_STATUS_HAS_EXPIRED = '4'
export const SCENE_CONFIG_STATUS_DELETED = '5'
export const SCENE_CONFIG_STATUS_MAP = {
  [SCENE_CONFIG_STATUS_TO_BE_EFFECTIVE]: {
    name: '待生效',
    value: '1',
    checked: true,
  },
  [SCENE_CONFIG_STATUS_IN_EFFECT]: {
    name: '生效中',
    value: '2',
    checked: true,
  },
  [SCENE_CONFIG_STATUS_DOWNLINE]: {
    name: '下线',
    value: '3',
    checked: true,
  },
  [SCENE_CONFIG_STATUS_HAS_EXPIRED]: {
    name: '已过期',
    value: '4',
    checked: true,
  },
  [SCENE_CONFIG_STATUS_DELETED]: {
    name: '已删除',
    value: '5',
    checked: true,
  },
}

export const SCENE_CONFIG_STATUS = Object.keys(SCENE_CONFIG_STATUS_MAP).map(cur => ({
  id: cur,
  ...SCENE_CONFIG_STATUS_MAP[cur],
}))
