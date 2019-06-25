import { 
  fetch,
  json
} from '@didi/fate-common'
const {
  jsonToParams,
} = json

export async function fetchPushToolActivityList(params) {
  const result = await fetch('/api/push/activity/query', {
    method: 'post',
    // data: paramsToString(param),
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}

export async function fetchPushToolDetail(params) {
  const result = await fetch(`/api/push/activity/detail?${params && jsonToParams(params)}`)
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}

export async function fetchUserTag(params) {
  const result = await fetch(`/api/user-tag/query?${params && jsonToParams(params)}`)
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}

export async function fetchPushToolTemplateTag(params) {
  const result = await fetch('/api/push/activity/template/labels')
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}

export async function fetchPushToolCouponList(params) {
  const result = await fetch(`/api/general/coupon/query?${params && jsonToParams(params)}`)
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}

export async function fetchPushGroupQueryListApi(params) {
  const result = await fetch('/api/push/group/query', {
    method: 'post',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}
export async function fetchPushToolEquityListApi(params) {
  const result = await fetch(`/api/push/award/list?${params && jsonToParams(params)}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let data = {}
  if (result && result.data) {
    data = result.data
  }
  return data
}