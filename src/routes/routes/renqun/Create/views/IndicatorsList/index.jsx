import React, { Component } from 'react'
import {
  connect,
} from 'react-redux'
import T from 'prop-types'
import {
  Icon,
  Tooltip,
} from 'antd'
import './index.styl'

class IndicatorsList extends Component {
  static defaultProps = {
    data: [],
    choosedIds: [],
  }
  static propTypes = {
    data: T.array.isRequired,
    choosedIds: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      indicators: props.data || [],
      choosedIds: Array.from(props.choosedIds || []),
    }
    this.renderIndicators = this.renderIndicators.bind(this)
  }
  renderIndicators = (indicators) => {
    const { choosedIds } = this.props
    return indicators.map(item =>
      (<div
        draggable
        data-content={JSON.stringify(item)}
        className={choosedIds.some(item1 => item1 == item.metricId) ?
          'indicator-item checked' : 'indicator-item'}
      >
        <span>{item.metricNameZh}</span>
        <Tooltip
          placement="top"
          title={[
            <p>{item.metricDescription}</p>,
          ]}
        >
          <Icon type="question-circle-o" />
        </Tooltip>
        <span>{item.useCount}次</span>
      </div>),
    )
  }
  render() {
    const { data: indicators } = this.props
    return (
      <div className="indicator-list">
        {this.renderIndicators(indicators)}
      </div>
    )
  }
}
export default connect(
  state => ({
    choosedIds: state.crowdTag.createdIndicatorsData.choosedIds,
  }),
)(IndicatorsList)
