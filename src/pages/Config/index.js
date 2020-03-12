import React from 'react'
import { Col, Button, Tabs, Form, Checkbox } from 'antd'
// import { delay } from '@/utils/web'
import { SYSTEM_MODULES, MODEL_LIFECYCLE, USER_GROUP } from './constant'
import {
  StyleConfig,
  StyleManagement,
  StyleGroup,
  StyleModel,
  StyleLifecycle,
  StyleConfiguration,
  StylePermission
} from './style'
import Legend from '@/assets/images/legend.png'

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: '2',
      modelLifecycle: [],
      permission: [
        {
          name: 'Administrator',
          privilege: [],
          user: ['Jack(00001)', 'lucy(00002)', 'mary(00003)']
        },
        {
          name: 'Engineer',
          privilege: [],
          user: ['Jack(00001)']
        },
        {
          name: 'Operator',
          privilege: [],
          user: ['lucy(00002)', 'mary(00003)']
        }
      ]
    }
  }

  componentDidMount() {
    this.setState({ modelLifecycle: MODEL_LIFECYCLE })
  }

  onModulesChange = modules => {
    console.log(modules)
  }

  render() {
    const { activePane } = this.state
    const { modelLifecycle } = this.state
    const { permission } = this.state

    return (
      <StyleConfig>
        <Tabs defaultActiveKey={activePane} onChange={activePane => this.setState({ activePane })}>
          <Tabs.TabPane tab='Management' key='1'>
            <img src={Legend} alt='' />
            <StyleManagement>
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
          </Tabs.TabPane>
          <Tabs.TabPane tab='Configuration' key='2'>
            <StyleConfiguration>
              <StylePermission>
                <h4>User & Privilege</h4>
                {USER_GROUP.map(group => (
                  <Form key={group} layout='vertical' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    <h5>{group}</h5>
                    <Form.Item label='Privilege'>
                      <Checkbox.Group
                        options={SYSTEM_MODULES}
                        onChange={modules => this.onModulesChange(group, modules)}
                      />
                    </Form.Item>
                    <Form.Item label='User'>
                      <span>{permission.filter(per => per.name === group)[0].user.map(u => `${u}; `)}</span>
                      <Button size='small'>Edit</Button>
                    </Form.Item>
                  </Form>
                ))}
              </StylePermission>
            </StyleConfiguration>
          </Tabs.TabPane>
        </Tabs>
      </StyleConfig>
    )
  }
}

export default Config
