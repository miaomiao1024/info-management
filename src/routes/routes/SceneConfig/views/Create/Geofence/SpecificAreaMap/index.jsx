import React, { Component } from 'react'
import {
  Icon,
  Input,
  Row,
  Col,
  Select,
} from 'antd'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import './index.styl'
const Option = Select.Option
let specificAreaMap
let marker
let circle

class SpecificArea extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      center:[116.413032,39.910567],
      positonValue:'',
      
    }
  }
  componentDidMount() {
    this.initMap()
    var mybounds = new AMap.Bounds([116.075391,39.797068], [116.683759,40.007769]);
    this.map.setBounds(mybounds);
    
  }
  componentWillUnmount(){
    marker = 0
    circle = 0
  }
  resetMapInfo = () => {
    // 获取地图的边界
    this.setState({
      bounds: this.map.getBounds(),
    })
    return new Promise((resolve) => {
      // 获取当前城市
      this.map.getCity((data) => {
        this.setState({
          cityName: data && (data.city || data.province),
        }, () => {
          resolve()
        })
      })
    })
  }
  initMap = () => {
    this.map = new AMap.Map('bigMap', {
      resizeEnable: false,//是否监控地图容器尺寸变化
      zoom: '11',//初始化地图层级
      dragEnable: true,
      center: [116.413032,39.910567],//初始化地图中心点
      doubleClickZoom: false, // 地图是否可通过双击鼠标放大地图，默认为true
    })
    specificAreaMap = this.map
    AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
      const zoomCtrl = new BasicControl.Zoom({
        theme: 'dark',
      })
      this.map.addControl(zoomCtrl)
    })
   
    //监听双击事件
    this.map.on('dblclick',(e) => {
      console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
      const lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()]
      //控制单次打点
      if(!marker){
        this.addMarker(lnglatXY)
        this.addCircle(lnglatXY)
      }else{
        marker.setPosition(lnglatXY)
        circle.setCenter(lnglatXY)
      }
      this.getPositionName(lnglatXY)
    }) 
  }
  //高德地图打点
  addMarker = (lnglat) => {
    marker =  new AMap.Marker({
      map: this.map,
      position: lnglat,
    });
    marker.setMap(this.map);
  }
  addCircle = (lnglat) => {
    circle = new AMap.Circle({
      center: lnglat,
      radius: 3000, //半径
      borderWeight: 0,
      strokeColor: "#FF33FF", 
      strokeOpacity: 0.3,
      strokeWeight: 0,
      strokeOpacity: 0,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10], 
      fillColor: '#1791fc',
      zIndex: 50,
    })
    circle.setMap(this.map)
    this.map.setFitView([ circle ])
  }
  //逆地理编码--根据其经纬度获取其具体地址信息
  getPositionName = (lnglat) => {
    const geocoder = new AMap.Geocoder({
      city: '010', // 城市，默认：“全国”
      radius: 1000, // 范围，默认：500
    })
    geocoder.getAddress(lnglat, (status, result) =>{
      if (status === 'complete' && result.info === 'OK') {
        console.log(result.regeocode.formattedAddress)
      }
    })
  }
  //正向地理编码--根据具体位置获取经纬度
  getCityPosition = (positionName) => {
    console.log(positionName)
  }
  


  selectProvince = (value) => {
    if(value === '1'){
      this.map.setCenter([116.413032,39.910567])
    }
    if(value === '2'){
      this.map.setCenter([120.209338,30.238572])
    }
  }
  
  positonValueChange= (value) => {
    console.log(value)
    this.setState({positonValue:value})
  }
  render() {
    const { positonValue } = this.state
    return (
      <div className="specific_area_page">
        <Row>
          <Col span={6}>
            <Select onChange={(value) => this.selectProvince(value)} defaultValue="1">
              <Option value="1">北京</Option>
              <Option value="2">浙江</Option>
            </Select>
          </Col>
          <Col span={6} offset={1}>
            <Select defaultValue="beijing">
              <Option value="beijing">北京</Option>
              <Option value="hangzhou">杭州</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{margin:'20px 0'}}>
          <Col span={10}>
            <Input 
              placeholder="请输入具体位置信息" 
              value={positonValue} 
              onChange={(value) => this.positonValueChange(value)} 
            />
          </Col>
          <Col span={2} offset={1}>
            <Select defaultValue="3">
              <Option value="3">3</Option>
              <Option value="4">5</Option>
              <Option value="5">10</Option>
            </Select> 
          </Col> 
          <Col span={6} offset={1}> 
            公里范围内 <Icon type="plus-circle-o" className='icon-style'/>
          </Col> 
        </Row>
        <Row>
          <div className="map-container" id="bigMap" ref='map1'/>
        </Row>
      </div>
    )
  }

}
export default SpecificArea

export {specificAreaMap}