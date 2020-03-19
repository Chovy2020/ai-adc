import React from 'react'
import { Tabs } from 'antd'
import { connect } from 'react-redux'
import { changeMenu } from '@/utils/action'
// import { delay } from '@/utils/web'
// import { SYSTEM_MODULES, ROLES } from './constant'
import ModelGroup from './component/ModelGroup'
import { StyleConfig } from './style'

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: '1'
    }
  }

  componentDidMount() {
    this.props.changeMenu('config')
  }

  render() {
    const { activePane } = this.state

    return (
      <StyleConfig>
        <Tabs defaultActiveKey={activePane} onChange={activePane => this.setState({ activePane })}>
          <Tabs.TabPane tab='Model Group' key='1'>
            <ModelGroup />
          </Tabs.TabPane>
        </Tabs>
      </StyleConfig>
    )
  }
}

const mapDispatchToProps = { changeMenu }
export default connect(() => ({}), mapDispatchToProps)(Config)
