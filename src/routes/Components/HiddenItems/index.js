import React,{Component} from 'react';
import _ from 'lodash'
import { Modal } from 'antd';
import './style.styl'

export default class HiddenItems extends Component{
  state={
    show:false
  }
  onClick=()=>{
    this.setState({show:!this.state.show})
  }
  render(){
    let {count,data} = this.props
    data = _.cloneDeep(data)
    let hiddenItems = ""
    if(data.length > count ){
      hiddenItems = `${data.map(cur => cur.name).join(',')}可用`
    }
    data = `${data.splice(0,count).map(cur => cur.name).join(",")}`
    return(<div className="hidden-items">
      {data}
      {
        hiddenItems&&
        [<span 
          className="show-more" 
          onClick={this.onClick} >查看全部
        </span>,
        <Modal 
          className="hidden-items-modal" 
          visible={this.state.show}  
          onCancel={this.onClick}
          footer={null}
        >
          <div className="container-fluid">
            {hiddenItems}
          </div>
        </Modal>]
      }
    </div>)
  }
}
