import Mock from 'mockjs'

// //充电站列表 /api/charge/opponent/station/query
// Mock.mock(/api\/charge\/opponent\/station\/query/, 'get', {
//   status: 10000,
//   title: "提示",
//   msg: "OK",
//   data: {
//     "total": '55',
//     pageCount: /\d{2}/,
//     pageIndex: /\d{1}/,
//     pageSize: 10,
//     "items|15": [
//       {
//         fullStationId: /\d{5}/,
//         stationName: '@ctitle(5, 8)站',
//         creator: '@ctitle(2, 3)',
//         station_type: { id: 1, name: "竞品电站" },
//         operatorName: "@ctitle(2, 3)运营商",
//         create_time: "2018-@integer(10,12)-@integer(10,29)",
//         station_status: { id: 1, name: "已上线" },
//         "HistoricalSnapshot|15": [
//           {
//             fullStationId: /\d{5}/,
//             stationName: '@ctitle(5, 8)站',
//             station_type: { id: 1, name: "竞品电站" },
//             operatorName: "@ctitle(2, 3)运营商",
//             update_time: "2018-@integer(10,12)-@integer(10,29)",
//             operator: '@ctitle(2, 3)',
//             freeParkMark: { id: 1, name: "是" },
//             fast_connector_count: /\d{2}/,
//             slow_connector_count: /\d{2}/,
//             station_address: '@ctitle(5, 8)地址',
//             station_status: { id: "@integer(1,2)", name: "已上线" },
//             park_text: '@ctitle(5, 8)',
//             connector_power_json: /\d{2}/,
//             good_mark: { id: 1, name: "好站" },
//             operator_mark: { id: 1, name: "自营" },
//             test_station_mark: { id: 1, name: "测试站" },
//             open_mark: { id: 1, name: "对外开放" }
//           }
//         ]
//       }
//     ]
//   }
// })

// // 运营商列表 
// Mock.mock(/api\/charge\/opponent\/station\/operators/, 'get', {
//   status: 10000,
//   title: "提示",
//   msg: "OK",
//   data: ["IGO","万城万充","万马爱充","中恒","中研能源","中装","云快充","云杉","云速快充","亨通",
//     "依威能源","充电队长","免费","兴国","利天充","劲桩","华瑞","厦门七零七","合创充电","哪儿充","坚信",
//     "天枢","奥能","安实新能源","安悦","安悦充","富电","富电（旧）","小桔充电","巴斯巴","康亿创","捷电通",
//     "新未来","既济电力","易事特","星星充电","普天","智充","智充新能源","智网","智轲","智道","欣机","正方",
//     "永易充","汇充","澄鹏","特享新能源","特来电","猴王充电","电多多","电驴","畅的","畅的北京","百城","百源",
//     "科华","粤盛","线上测试站","绿捷","绿盈","绿盈新能源","聚隆","能瑞","能翔巴士","致联","蓝狮","赤兔马",
//     "车电网","迅鹿充能","连和新能源","速电通","金威源","隆邦恒电","靖正","顺充","驱动源","驿威","驿联",
//     "高陆通","鹏辉","鼎充"]
// })

// // 上下线
// Mock.mock(/api\/govern\/station\/list\/delete/, 'get', {
//   status: 10000,
//   title: "提示",
//   msg: "OK",
//   data: []
// })

// // 充电站详情
// Mock.mock(/api\/govern\/station\/detail/, 'get', {
//   status: 10000,
//   title: "提示",
//   msg: "OK",
//   data: {
//     fullStationId: /\d{5}/,
//     stationName: '@ctitle(5, 8)站',
//     creator: '@ctitle(2, 3)',
//     station_type: { id: 1, name: "竞品电站" },
//     operator_name: "@ctitle(2, 3)运营商",
//     create_time: "2018-@integer(10,12)-@integer(10,29)",
//     station_address: '@ctitle(5, 8)地址',
//     "HistoricalSnapshot|15": [
//       {
//         fullStationId: /\d{5}/,
//         stationName: '@ctitle(5, 8)站',
//         creator: '@ctitle(2, 3)',
//         station_type: { id: 1, name: "竞品电站" },
//         operator_name: "@ctitle(2, 3)运营商",
//         city:"北京",
//         create_time: "2018-@integer(10,12)-@integer(10,29)",
//         latitude:"30.@integer(100000,999999)",
//         longitude:"120.@integer(100000,999999)",
//         fast_connector_count: /\d{2}/,
//         slow_connector_count: /\d{2}/,
//         total_connector_count: /\d{2}/,
//         active_connector_count: /\d{2}/,
//         station_address: '@ctitle(5, 8)地址',
//         station_status: { id: 1, name: "已上线" },
//         connector_power_json: /\d{2}/,
//         order_count: /\d{2}/,
//         predict_order_count: /\d{2}/,
//         activity_price_json: /\d{2}/,
//         category:  { id: 1, name: "是" },
//         free_park_mark:{ id: 1, name: "是" },
//         market_price_json: /\d{2}/,
//         exception_rate: "@integer(1,2)",
//         charge_power: /\d{2}/,
//         charge_time: /\d{2}/,
//         predict_charge_time: /\d{2}/,
//         electric_price: /\d{2}/,
//         service_price: /\d{2}/,
//         total_price: /\d{2}/,
//         spider_price_json: /\d{2}/
//       }
//     ],
//   }
// })

// //充电站模糊搜索
// Mock.mock(/api\/charge\/opponent\/station\/stations/, 'get', {
//   status: 10000,
//   title: "提示",
//   msg: "OK",
//   "data|15": [
//     {
//       "id": null,
//       "operatorName": "@ctitle(2, 3)",
//       "fullStationId": /\d{8}/,
//       "stationName": "@ctitle(5, 6)",
//       "fastChargeNum": /\d{2}/,
//       "slowChargeNum": /\d{2}/,
//       "stationAddress": "@ctitle(8, 10)",
//       "lat": "30.@integer(100000,999999)",
//       "lng": "120.@integer(100000,999999)",
//       "cityId": 4,
//       "isParkFree": 1,
//       "parkFree": null,
//       "chargeFeeList": [
//         {
//           "startTime": "00:00",
//           "endTime": "00:00",
//           "elecPrice": 0.0,
//           "servPrice": 0.8
//         },
//         {
//           "startTime": "00:00",
//           "endTime": "24:00",
//           "elecPrice": 1.2,
//           "servPrice": 0.8
//         }
//       ],
//       "powerList": [
//         {
//           "connectorType": 3,
//           "connectorPower": 7.0
//         }
//       ],
//       "operator": null,
//       "operatorZh": null,
//       "createTime": null,
//       "updateTime": null
//     }
//   ]
// })
