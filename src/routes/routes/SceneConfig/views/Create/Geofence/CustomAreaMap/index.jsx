import React, { Component } from 'react'
import AMap from 'AMap'
import {message,Tag,Button} from 'antd'
import './index.styl'

const { CheckableTag } = Tag;
let customAreaMap,polygonMouseTool

class CustomArea extends Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.initMap()
    var mybounds = new AMap.Bounds([116.075391,39.797068], [116.683759,40.007769]);
    this.map.setBounds(mybounds);
    
  }
  initMap = () => {
    this.map = new AMap.Map('customAreaMap', {
      resizeEnable: false,
      zoom: '11',
      center: [116.413032,39.910567],
    })
    customAreaMap = this.map
    //polygonMouseTool = new AMap.MouseTool(this.map); 
    /* polygonMouseTool.on('draw', () => {
      message.info('覆盖物对象绘制完成')
    }) */
  }
  
  drawPolygon = (checked) => {
    console.log(checked)
    /* if(checked) {
      polygonMouseTool.polygon({
        fillColor:'#00b0ff',
        strokeColor:'#80d8ff'
      });
    } else {
      polygonMouseTool.close(true)
    } */
  }
  
  
  render() {
    
    return (
      <div className="custom_area_page">
        <Button onClick={this.drawPolygon}>区块管理</Button>
        <div className="map-container" id="customAreaMap" ref='map2'/>
      </div>
    )
  }

}
export default CustomArea
export {
  customAreaMap,
  polygonMouseTool
}