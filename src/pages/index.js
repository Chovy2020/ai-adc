import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import styled from 'styled-components'
import Favicon from '@/assets/images/favicon.png'
import { changeMenu } from '@/utils/action'
// import { injectReducer } from '@/utils/store'

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
const MODULES = [
  {
    title: 'Manual Classification',
    link: 'manual'
  },
  {
    title: 'Defect Library',
    link: 'library'
  },
  {
    title: 'ADC Builder',
    link: 'builder'
  },
  {
    title: 'Reporting',
    link: 'reporting'
  },
  {
    title: 'Mgt & Config',
    link: 'config'
  }
]

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

  onButtonClick = () => {
    let { num } = this.state
    num += 1
    this.setState({ num })
  }

  render() {
    // const { msg, num } = this.state

    return (
      <div className='App'>
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
      </div>
    )
  }
}

// injectReducer('ADC', reducer)
const mapStateToProps = state => ({ ...state.Init })
const mapDispatchToProps = { changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(ADC)
