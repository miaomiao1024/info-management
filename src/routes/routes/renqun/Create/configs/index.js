/* ------------push/biz-line------------- */
export const PUSH_BUSINESS_JIA_YOU = '159'
export const PUSH_BUSINESS_WEI_BAO = '187'

export const PUSH_BUSINESSES_MAP = {
  [PUSH_BUSINESS_JIA_YOU]: '加油',
  [PUSH_BUSINESS_WEI_BAO]: '维保',
}

export const PUSH_BUSINESSES = Object.keys(PUSH_BUSINESSES_MAP).map(cur => ({
  id: cur,
  name: PUSH_BUSINESSES_MAP[cur],
  disabled: false,
}))

