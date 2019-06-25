import { 
  fetch,
  json
} from '@didi/fate-common'
const {
  jsonToParams,
} = json 

export async function fetchMetricListApi(params) {
  const { data } = await fetch(`/api/tag/metric/queryList?${params && jsonToParams(params)}`)
  return data
}
export async function fetchCategoryListApi(params) {
  console.log(params)
  const { data } = await fetch(`/api/tag/category/queryList?${params && jsonToParams(params)}`)
  return data
}

export async function fetchUserTag(params) {
  const { data } = await fetch(`/api/user-tag/category/query?${params && jsonToParams(params)}`)
  return data
}
export async function getMetricDetailApi(params){
  const { data } = await fetch(`/api/tag/metric/queryList?${params && jsonToParams(params)}`)
  return data
}

