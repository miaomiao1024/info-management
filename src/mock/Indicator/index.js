import Mock from 'mockjs'

Mock.mock(/api\/indicator/, 'get', {
  status:10000,
  indicatorEncyclopedia:[{
    indicatorID: '10001',
    indicatorEnglishName: 'base_reg_city_id',
    indicatorChineseType: '注册城市',
    indicatorComment: '司机注册城市id',
    dataType:'数值',
    userType:'司机',
    indicatorState:'已上线',
    controlType: '等于或不等于控件',
    indicatorType: '画像数值指标',
    oneName: '基础信息',
    twoName: '基础信息',
    createUser: '刘苗苗',
  },
  {
    indicatorID: '10002',
    indicatorEnglishName: 'base_reg_address_id',
    indicatorChineseType: '注册地址',
    indicatorComment: '用户可填写地址',
    dataType:'字符串',
    userType:'用户',
    indicatorState:'已下线',
    controlType: '大于等于控件',
    indicatorType: '基本数组',
    oneName: '小桔加油',
    twoName: '拉单数量',
    createUser: '刘苗苗',
  }]

})