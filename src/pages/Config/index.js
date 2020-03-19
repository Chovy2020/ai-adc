import React from 'react'
import {
  Button,
  Tabs,
  Form,
  Input,
  Table,
  message,
  Modal,
  AutoComplete,
  Select,
  List
} from 'antd'
import { connect } from 'react-redux'
import { changeMenu } from '@/utils/action'
// import { delay } from '@/utils/web'
import { SYSTEM_MODULES, ROLES } from './constant'
import {
  StyleConfig,
  StyleModelGroup,
  StyleGroupConfigure,
  StyleGroupTableContainer,
  StyleGroupTable,
  StyleHotkeys
} from './style'

const EditableContext = React.createContext()
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)
const EditableFormRow = Form.create()(EditableRow)
class EditableCell extends React.Component {
  state = {
    editing: false
  }
  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }
  save = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }
  renderCell = form => {
    this.form = form
    const { children, dataIndex, record } = this.props
    const { editing } = this.state
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, { initialValue: record[dataIndex] })(
          <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
        )}
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
        {children}
      </div>
    )
  }
  render() {
    const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props
    return (
      <td {...restProps}>
        {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
      </td>
    )
  }
}

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: '1',
      selected: [],
      target: [],
      groups: [
        {
          id: 1,
          name: 'group 001',
          data: [
            {
              key: 1,
              product: 'Device1',
              step: 'StepA'
            },
            {
              key: 2,
              product: 'Device1',
              step: 'StepB'
            }
          ]
        },
        {
          id: 2,
          name: 'group 002',
          data: [
            {
              key: 3,
              product: 'Device1',
              step: 'StepA'
            },
            {
              key: 4,
              product: 'Device1',
              step: 'StepB'
            }
          ]
        }
      ],
      activeGroupId: null,
      // hotkeys
      visible: false,
      classCodes: ['0-No_Review', '1-FALSE', '2-Unknown', '278-MG_Replaced', '279-MG_Missing'], // ！通过接口获取
      classCode: '',
      hotkeys: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      hotkey: '',
      hotkeyMapping: {
        A: '0-No_Review',
        B: '1-FALSE',
        C: '2-Unknown'
      }
    }
  }

  componentDidMount() {
    this.props.changeMenu('config')
  }

  handleSave = (groupId, row) => {
    const { groups } = this.state
    for (const group of groups) {
      if (group.id === groupId) {
        for (const i in group.data) {
          if (group.data[i].key === row.key) {
            group.data[i] = row
            break
          }
        }
      }
    }
    this.setState({ groups })
  }
  handleDelete = rowKey => {
    console.log(rowKey)
    const { groups } = this.state
    for (const i in groups) {
      for (const j in groups[i].data) {
        if (groups[i].data[j].key === rowKey) {
          groups[i].data.splice(j, 1)
          break
        }
      }
    }
    this.setState({ groups })
  }
  onAddGroup = () => {
    const { groups } = this.state
    groups.push({
      id: Math.floor(Math.random() * 1000000),
      name: 'group 002',
      data: [
        {
          key: 5,
          product: 'Device1',
          step: 'StepA'
        },
        {
          key: 6,
          product: 'Device1',
          step: 'StepB'
        }
      ]
    })
    this.setState({ groups })
  }
  onAddGroupTableRow = groupId => {
    const { groups } = this.state
    for (const i in groups) {
      if (groups[i].id === groupId) {
        groups[i].data.push({
          key: Math.floor(Math.random() * 1000000),
          product: '',
          step: ''
        })
      }
    }
    this.setState({ groups })
  }
  onUpdateGroup = () => {
    message.success('Update successfully')
  }
  onHotkeyOk = () => {
    this.setState({ visible: false })
    message.success('Hotkeys save successfully')
  }
  onAssignHotkey = () => {
    const { hotkeyMapping, hotkey, classCode } = this.state
    hotkeyMapping[hotkey] = classCode
    this.setState({ hotkeyMapping })
  }
  onDeleteHotkey = key => {
    const { hotkeyMapping } = this.state
    delete hotkeyMapping[key]
    this.setState({ hotkeyMapping })
  }

  render() {
    const { activePane } = this.state
    const { groups, activeGroupId } = this.state
    const { visible, classCodes, classCode, hotkeys, hotkey, hotkeyMapping } = this.state

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const COLUMNS = [
      {
        width: '44%',
        title: 'Product',
        dataIndex: 'product',
        editable: true
      },
      {
        width: '44%',
        title: 'Step',
        dataIndex: 'step',
        editable: true
      },
      {
        width: '12%',
        title: ' ',
        render: (text, record) => (
          <Button type='danger' shape='circle' icon='delete' onClick={() => this.handleDelete(record.key)} />
        )
      }
    ]
    const GROUP_COLUMNS = group =>
      COLUMNS.map(col => {
        if (!col.editable) {
          return col
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: row => this.handleSave(group, row)
          })
        }
      })

    return (
      <StyleConfig>
        <Tabs defaultActiveKey={activePane} onChange={activePane => this.setState({ activePane })}>
          <Tabs.TabPane tab='Model Group' key='1'>
            <StyleModelGroup>
              <StyleGroupConfigure>
                <h4>Model Group Configure</h4>
                <div style={{ padding: '0 20px' }}>
                  <Button size='small' type='primary' onClick={this.onAddGroup}>
                    Add
                  </Button>
                  <Button size='small' type='primary' onClick={this.onUpdateGroup}>
                    Update
                  </Button>
                  <Button
                    size='small'
                    type='primary'
                    disabled={activeGroupId === null}
                    onClick={() => this.setState({ visible: true })}
                  >
                    Hotkeys
                  </Button>
                </div>
                <StyleGroupTableContainer>
                  {groups.map(g => (
                    <StyleGroupTable
                      key={g.id}
                      onClick={() => this.setState({ activeGroupId: g.id })}
                      className={activeGroupId === g.id ? 'active' : ''}
                    >
                      <h4>{g.name}</h4>
                      <Table
                        size='small'
                        pagination={false}
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={g.data}
                        columns={GROUP_COLUMNS(g.id)}
                      />
                      <Button
                        size='small'
                        shape='circle'
                        icon='plus'
                        type='primary'
                        onClick={() => this.onAddGroupTableRow(g.id)}
                        style={{ marginTop: 2 }}
                      ></Button>
                    </StyleGroupTable>
                  ))}
                </StyleGroupTableContainer>
              </StyleGroupConfigure>
              <Modal
                title='Hotkey Setup'
                visible={visible}
                onOk={this.onHotkeyOk}
                onCancel={() => this.setState({ visible: false })}
              >
                <StyleHotkeys>
                  <Select
                    size='small'
                    style={{ width: 120 }}
                    defaultValue={hotkey}
                    onChange={hotkey => this.setState({ hotkey })}
                  >
                    {hotkeys.map(k => (
                      <Select.Option value={k} key={k}>
                        {k}
                      </Select.Option>
                    ))}
                  </Select>
                  <AutoComplete
                    allowClear
                    size='small'
                    filterOption={true}
                    defaultValue={classCode}
                    dataSource={classCodes}
                    style={{ width: 150 }}
                    onSelect={classCode => this.setState({ classCode })}
                  />
                  <Button type='primary' size='small' onClick={this.onAssignHotkey} style={{ marginLeft: 10 }}>
                    Assign
                  </Button>
                </StyleHotkeys>
                <List
                  itemLayout='horizontal'
                  dataSource={Object.keys(hotkeyMapping)}
                  renderItem={key => (
                    <List.Item actions={[<span onClick={() => this.onDeleteHotkey(key)}>Delete</span>]}>
                      {`${key} - ${hotkeyMapping[key]}`}
                    </List.Item>
                  )}
                />
              </Modal>
            </StyleModelGroup>
          </Tabs.TabPane>
        </Tabs>
      </StyleConfig>
    )
  }
}

const mapDispatchToProps = { changeMenu }
export default connect(() => ({}), mapDispatchToProps)(Config)
