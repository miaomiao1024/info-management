import React,{Component} from 'react';
import { Input } from 'antd';
// import normalizeNumber from 'turbo-component-react/utils/normalize-number'
import {checkFormValueByKey,isType} from '../Lib/tool.fn';

export default class InputNew extends Component{
	state={
	  hasError:false,
	}
	onChange=(e)=>{
	  const onChange = this.props.onChange
	  const {len,min,max,valuetype,tofix} = this.props
	  let value = e.target.value
	  // console.log('this.state.value', this.state.value)
	  if(isType(value,"[object Undefined]")){
	    value = ""
	  }

	  if(valuetype === "string" ){
	    if(isType(len,"[object Number]") && len < value.length){
	      return this.forceUpdate()
	    }
	  }


	  if(valuetype === "number" ){
	    if(Number(value) === Number(this.props.value)){
	      return null
	    }
	    if(!isType(Number(value),"[object Number]")){
	      return this.forceUpdate()
	    }

	    if(isType(tofix,"[object Number]")){
	      // value = normalizeNumber(value,tofix)
	    }
			
	    if(isType(max,"[object Number]")){
	      if(Number(value) > max){
	        value = max
	      }
	    }
	    if(isType(min,"[object Number]")){
	      if(Number(value) < min){
	        value = min
	      }
	    }
	    value = Number(value) || ""
	  }

	  if(valuetype === "phone"){
	    value = String(value) || ""
	    if(value){
	      const checkvalue = value.match(/^([\d]+(\s|\,|，)?){0,20}/g)
	      value = ""
	      if(checkvalue.length){
	        value = checkvalue[0].split(/\s|\,|，/g).join(",")

	      }
	    }

	  }
		

	  if(this.props.onChange){
	    // const { value } = this.state;
	    this.props.onChange(value,e)
	  }
	}
	onBlur=(e)=>{
	  const {len,min,max,valuetype} = this.props
	  if(valuetype === "phone" ){

	  }
	}
	render(){
	  let {onChange,len,min,max,value,valuetype,tofix,...props} = this.props
	  let {hasError} = this.state


	  if(isType(value,"[object Undefined]")){
	    value = ""
	  }
	  if(this.props.hasOwnProperty("value")){
	    props.value = value
	  }

	  return <Input onChange={this.onChange} onBlur={this.onBlur} {...props} />


	}

}
// <div className={hasError?" has-error has-feedback":""}>
// 				<Input onChange={this.onChange} onBlur={this.onBlur} {...props} />
// 				{hasError&&<span className="glyphicon glyphicon-remove form-control-feedback"></span>}
	
// 		</div>
