import Mock from 'mockjs'

Mock.mock(/api\/hello/, 'get', {
  name: 'world'
})