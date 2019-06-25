import React, {
  Component,
} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Select,
  Form,
} from 'antd'
import { actions } from '@modules/Common'

// import {
//   noop,
// } from '../../../configs'

const {
  Option,
} = Select
class SelectSection extends Component {
  static defaultProps = {
    value: [],
    section: {},
    // onChange: noop,
  }
  static propTypes = {
    value: T.array,
    section: T.object,
    // onChange: T.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || [],
    }
  }
  componentDidMount() {
    const { getSections } = this.props.actions
    getSections()
  }
  componentWillReceiveProps(nextProps) {
    const {
      value,
    } = nextProps
    this.setState({
      value: value || [],
    })
  }
  handleLevelOneChange = (val) => {
    // const {
    //   onChange,
    // } = this.props
    const value = [val, '']
    this.setState({
      value,
    })
    // onChange(value)
  }
  handleLevelTwoChange = (val) => {
    // const {
    //   onChange,
    // } = this.props
    const {
      value,
    } = this.state
    value[1] = val
    this.setState({
      value,
    })
    // onChange(value)
  }
  render() {
    const {
      // value,
      section,
    } = this.props
    const {
      value,
    } = this.state
    const {
      sections,
      sectionsMap,
    } = section
    return (
      <div className="select-section" style={{display: 'flex'}}>
        <Select
          allowClear
          onChange={this.handleLevelOneChange}
          value={value[0]}
          placeholder="一级部门"
          style={{marginRight: '10px'}}
        >
          {
            sections && sections.length
            && sections.map(cur => (
              <Option key={cur.id} value={cur.id}>{cur.name}</Option>
            ))
          }
        </Select>
        <Select
          allowClear
          placeholder="二级部门"
          onChange={this.handleLevelTwoChange}
          value={value[1]}
        >
          {
            sectionsMap && sectionsMap[value[0]] && sectionsMap[value[0]].children
            && sectionsMap[value[0]].children.map(cur => (
              <Option key={cur.id} value={cur.id}>{cur.name}</Option>
            ))
          }
        </Select>
      </div>
    )
  }
}
export default connect(state => ({
  section: state.common.section,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectSection))
