import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import styled from 'styled-components'
import Favicon from '@/assets/images/favicon.png'
import { changeMenu } from '@/utils/action'
import { MODULES } from '@/utils/constant'

const StyleModules = styled.ul`
  list-style: none;
  width: calc(290px * 4 + 40px);
  margin-bottom: 0;
  padding: 20px;
  li {
    width: 250px;
    height: 230px;
    margin: 20px;
    float: left;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 16px;
      height: 100%;
      color: #fff;
      .ant-card {
        width: 100%;
        .ant-card-head-title {
          padding: 11px 0;
        }
        .ant-card-body {
          padding: 0;
          height: 180px;
          overflow: hidden;
          img {
            width: 100%;
            margin-top: -30px;
          }
        }
      }
    }
  }
`

class ADC extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: 'hello world',
      num: 1
    }
  }

  componentDidMount() {
    this.props.changeMenu('adc')
  }

  render() {
    return (
      <StyleModules>
        {MODULES.map(m => (
          <li key={m.title}>
            <Link to={m.link}>
              <Card title={m.title}>
                <img src={Favicon} alt='' />
              </Card>
            </Link>
          </li>
        ))}
      </StyleModules>
    )
  }
}

const mapDispatchToProps = { changeMenu }
export default connect(() => ({}), mapDispatchToProps)(ADC)
