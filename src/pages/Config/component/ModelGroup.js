import React from 'react'
import _ from 'lodash'
import { Button, Form, Input, Table, message, Modal, AutoComplete, Select, List } from 'antd'
// import { delay } from '@/utils/web'
// import { SYSTEM_MODULES, ROLES } from './constant'
import { StyleModelGroup, StyleHotkeys, StyleEditModal } from '../style'

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

class ModelGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      group: null,
      groupVisible: false,
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
    this.loadGroups()
  }
  // 获取Groups
  loadGroups = () => {
    // call api ...
    const groups = [
      {
        id: '1240366113942941696',
        createTm: 1584590101089,
        updateTm: 1584599751561,
        remark: null,
        groupName: 'test group update',
        items: [
          {
            id: '1240366114081353728',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240366113942941696',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240366114085548032',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240366113942941696',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      },
      {
        id: '1240366787095166976',
        createTm: 1584590261598,
        updateTm: null,
        remark: null,
        groupName: 'test group 002',
        items: [
          {
            id: '1240366787095166977',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240366787095166976',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240366787099361280',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240366787095166976',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      },
      {
        id: '1240446605266522112',
        createTm: 1584609291732,
        updateTm: null,
        remark: null,
        groupName: 'test group 003',
        items: [
          {
            id: '1240446605266522113',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240446605266522112',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240446605270716416',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240446605266522112',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      },
      {
        id: '1240457046913101824',
        createTm: 1584582981218,
        updateTm: null,
        remark: null,
        groupName: 'test group 010',
        items: [
          {
            id: '1240457046913101825',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240457046913101824',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240457046913101826',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240457046913101824',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      },
      {
        id: '1240459790617063424',
        createTm: 1584583635368,
        updateTm: null,
        remark: null,
        groupName: 'test group 011',
        items: [
          {
            id: '1240459790617063425',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240459790617063424',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240459790617063426',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240459790617063424',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      },
      {
        id: '1240528031632764928',
        createTm: 1584599905293,
        updateTm: null,
        remark: null,
        groupName: 'test group insert',
        items: []
      },
      {
        id: '1240557326830690304',
        createTm: 1584635689728,
        updateTm: null,
        remark: null,
        groupName: 'test group 005',
        items: [
          {
            id: '1240557327023628288',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240557326830690304',
            productId: 'product 001',
            stepId: 'step 001'
          },
          {
            id: '1240557327032016896',
            createTm: null,
            updateTm: null,
            remark: null,
            groupId: '1240557326830690304',
            productId: 'product 002',
            stepId: 'step 002'
          }
        ]
      }
    ]
    for (const i in groups) {
      for (const j in groups[i].items) {
        groups[i].items[j].key = groups[i].items[j].id
      }
    }
    this.setState({ groups })
  }

  /* - - - - - - - - - - - - - - - - - - Groups - - - - - - - - - - - - - - - - - -  */
  // 修改Group热键
  onGroupHotkey = group => {
    this.setState({ group: _.cloneDeep(group), visible: true })
  }
  // 修改Group信息
  onGroupUpdate = group => {
    this.setState({ group: _.cloneDeep(group), groupVisible: true })
  }
  // 删除Group
  onGroupRemove = group => {
    Modal.confirm({
      title: 'Are you absolutely sure?',
      content: `This action cannot be undone. This will permanently delete the group:【${group.groupName}】.`,
      onOk() {
        message.success('Delete successfully')
      }
    })
  }
  /* - - - - - - - - - - - - - - - - - - Group - - - - - - - - - - - - - - - - - -  */
  // Group修改后，保存
  onGroupOk = () => {
    this.setState({ groupVisible: false })
    // call api & update group detail
    message.success('Save successfully')
  }
  // 添加Group表格行
  handleInsert = () => {
    const { group } = this.state
    group.items.push({
      key: `Temp-${new Date().getTime()}`,
      productId: 'Product Id',
      stepId: 'Step Id'
    })
    this.setState({ group: _.cloneDeep(group) })
  }
  // 删除Group表格行
  handleDelete = row => {
    // ...
  }
  // 保存Group表格行
  handleSave = row => {
    const { group } = this.state
    for (const i in group.items) {
      if (group.items[i].id === row.id) {
        group.items[i] = row
        break
      }
    }
    this.setState({ group })
  }
  /* - - - - - - - - - - - - - - - - - - Hotkeys - - - - - - - - - - - - - - - - - -  */
  // 添加或修改热键
  onAssignHotkey = () => {
    const { hotkeyMapping, hotkey, classCode } = this.state
    hotkeyMapping[hotkey] = classCode
    this.setState({ hotkeyMapping })
  }
  // 删除热键
  onDeleteHotkey = key => {
    const { hotkeyMapping } = this.state
    delete hotkeyMapping[key]
    this.setState({ hotkeyMapping })
  }
  // 保存热键
  onHotkeyOk = () => {
    this.setState({ visible: false })
    message.success('Hotkeys save successfully')
  }

  render() {
    const { groups, group, groupVisible } = this.state
    const { visible, classCodes, classCode, hotkeys, hotkey, hotkeyMapping } = this.state

    const COMPONENTS = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const COLUMNS = [
      {
        title: 'Group Name',
        dataIndex: 'groupName',
        width: '20%'
      },
      {
        title: 'Product Id & Step Id',
        render: (text, record) => (
          <p>{record.items.map((item, index) => `${index > 0 ? ', ' : ''}${item.productId}-${item.stepId}`)}</p>
        ),
        width: '70%'
      },
      {
        title: ' ',
        render: (text, record) => (
          <>
            <Button type='primary' shape='circle' icon='hourglass' onClick={() => this.onGroupHotkey(record)} />
            <Button type='primary' shape='circle' icon='edit' onClick={() => this.onGroupUpdate(record)} />
            <Button type='danger' shape='circle' icon='delete' onClick={() => this.onGroupRemove(record)} />
          </>
        ),
        width: '10%'
      }
    ]
    let GROUP_COLUMNS = [
      {
        width: '44%',
        title: 'Product Id',
        dataIndex: 'productId',
        editable: true
      },
      {
        width: '44%',
        title: 'Step Id',
        dataIndex: 'stepId',
        editable: true
      },
      {
        width: '12%',
        title: ' ',
        render: (text, record) => (
          <Button type='danger' shape='circle' icon='delete' onClick={() => this.handleDelete(record)} />
        )
      }
    ]
    GROUP_COLUMNS = GROUP_COLUMNS.map(col => {
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
          handleSave: row => this.handleSave(row)
        })
      }
    })

    return (
      <StyleModelGroup>
        <Table size='small' rowKey='id' pagination={false} columns={COLUMNS} dataSource={groups} />
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
        <StyleEditModal
          title='Model Group Config'
          visible={groupVisible}
          onOk={this.onGroupOk}
          onCancel={() => this.setState({ groupVisible: false })}
        >
          {group && (
            <>
              <Table
                size='small'
                pagination={false}
                components={COMPONENTS}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={group.items}
                columns={GROUP_COLUMNS}
              />
              <Button
                size='small'
                shape='circle'
                icon='plus'
                type='primary'
                onClick={this.handleInsert}
                style={{ marginTop: 10 }}
              ></Button>
            </>
          )}
        </StyleEditModal>
      </StyleModelGroup>
    )
  }
}

export default ModelGroup
