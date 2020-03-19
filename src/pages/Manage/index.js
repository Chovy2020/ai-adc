import React from 'react'
import { Col, Button } from 'antd'
import { connect } from 'react-redux'
import { changeMenu } from '@/utils/action'
import { MODEL_LIFECYCLE } from './constant'
import { StyleManagement, StyleGroup, StyleModel, StyleLifecycle } from './style'
import Legend from '@/assets/images/legend.png'

class Manage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modelLifecycle: []
    }
  }

  componentDidMount() {
    this.props.changeMenu('manage')
    this.setState({ modelLifecycle: MODEL_LIFECYCLE })
  }

  render() {
    const { modelLifecycle } = this.state

    return (
      <StyleManagement>
        <img src={Legend} alt='' />
        {modelLifecycle.map(group => (
          <StyleGroup key={group.id}>
            <h4>Group: {group.name}</h4>
            {group.models.map(model => {
              const LAST = model.lifecycle[model.lifecycle.length - 1]
              return (
                <StyleModel key={model.id}>
                  <Col span={3}>{model.name}</Col>
                  <StyleLifecycle span={18}>
                    {model.lifecycle.map(life => (
                      <React.Fragment key={life.id}>
                        <span className={life.status} style={{ flex: life.duration }} />
                        <span className='time'>{`${LAST.startTime}-${LAST.endTime}`}</span>
                      </React.Fragment>
                    ))}
                  </StyleLifecycle>
                  <Col className='log' span={1}>
                    <Button type='primary' size='small'>
                      log
                    </Button>
                  </Col>
                  <Col className='action' span={2}>
                    {LAST.status === 'Pirun' && <Button type='default' size='small' shape='circle' />}
                    {['Training', 'Production'].includes(LAST.status) && (
                      <Button type='danger' size='small' shape='circle' />
                    )}
                    {LAST.status === 'Pirun' && <Button type='primary' size='small' shape='circle' />}
                    {['Training', 'Pirun', 'Production'].includes(LAST.status) && (
                      <Button type='dashed' size='small' shape='circle' />
                    )}
                  </Col>
                </StyleModel>
              )
            })}
          </StyleGroup>
        ))}
      </StyleManagement>
    )
  }
}

const mapDispatchToProps = { changeMenu }
export default connect(() => ({}), mapDispatchToProps)(Manage)
