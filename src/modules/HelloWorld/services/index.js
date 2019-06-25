import { 
  fetch,
} from '@didi/fate-common'
const API = fetch
export async function getName(){
  const {data} = await API.get('/mock/api/hello');
  return data;
}

export async function getList(){
  const { data } = await API.get('/api/general/section/list');
  return data;
}



