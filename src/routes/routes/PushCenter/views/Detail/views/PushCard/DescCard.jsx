import React, { Component } from 'react'
import T from 'prop-types'
import {
  Row,
  Col,
} from 'antd'

export default class DescCard extends Component {
  static propTypes = {
    pushText: T.string.isRequired,
    landingPage: T.string.isRequired,
    pushChannelId: T.string.isRequired,
  }
  static defaultProps = {
    data: {},
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const colNameSpan = {
      span: 5,
    }
    const colValueSpan = {
      span: 12,
    }
    const {
      pushText,
      landingPage,
      originalLandingPage,
    } = this.props
    return (
      <div>
        <Row>
          <Col {...colNameSpan}>文案</Col>
          <Col {...colValueSpan}>{pushText}</Col>
        </Row>
        {this.props.pushChannelId !== '4'
        && <Row>
          <Col {...colNameSpan}>落地页</Col>
          <Col {...colValueSpan}>
            <a
              href={landingPage}
              target="_blank"
              style={{ textDecoration: 'underline', color: 'black' }}
            >{landingPage}</a>
          </Col>
        </Row>
        }
        {originalLandingPage &&
          <Row>
            <Col {...colNameSpan}>原始长链接</Col>
            <Col {...colValueSpan}>
              <a
                href={landingPage}
                target="_blank"
                style={{ textDecoration: 'underline', color: 'black' }}
              >{originalLandingPage}</a>
            </Col>
          </Row>

        }
        

      </div>

    )
  }
}
