import React from 'react'
import _ from 'lodash'
import { Button, Form, Input, Table, message, Modal, AutoComplete, Select, List } from 'antd'
// import { delay } from '@/utils/web'
// import { SYSTEM_MODULES, ROLES } from './constant'
import { getGroups, getClassCodes, getHotkeys, updateGroup, updateHotkeyList,addGroup, deleteGroup } from '../service'
import { StyleModelGroup, StyleHotkeys, StyleEditModal, StyleGroupFilter } from '../style'

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
      classCodes: [],
      classCode: '',
      hotkeys: [],
      hotkey: '',
      hotkeyMapping: [],
      addVisible: false,
      addGroupName: '',
      keyword:'all'
    }
  }

  async componentDidMount() {
    //groups
    this.loadGroups()
    //classCodes
    const classCodes = await getClassCodes()
    this.setState({ classCodes })
    //hotKey
    const hotkeys = []
    for (let i = 0; i < 26; i++) {
      hotkeys.push(String.fromCharCode(65 + i))
    }
    this.setState({ hotkeys })
  }
  // 获取Groups
  loadGroups = async () => {
    const {keyword} = this.state
    const groups = await getGroups(keyword)
    for (const i in groups) {
      for (const j in groups[i].items) {
        groups[i].items[j].key = groups[i].items[j].id
      }
    }
    this.setState({ groups:_.cloneDeep(groups) })
  }

  onSearch = async keyword => {
    if(keyword === null || keyword === ''){
      keyword = 'all'
    }
    await this.setState({keyword:_.cloneDeep(keyword)})
    this.loadGroups()
  }
  onAddGroup = async () => {
    const { addGroupName } = this.state
    if (addGroupName === '') {
      message.warning('Group name is required')
      return
    }
    this.setState({ addVisible: false })
    // call api
    const addData={
      groupName:addGroupName,
      productId:'',
      stepId:''
    }
    await addGroup(addData)
    this.loadGroups()
  }

  /* - - - - - - - - - - - - - - - - - - Groups - - - - - - - - - - - - - - - - - -  */
  // 修改Group热键
  onGroupHotkey = async group => {
    const hotkeyMapping = await getHotkeys(group.id)
    const { classCodes } = this.state
    for (let index1 in hotkeyMapping) {
      for (const index2 in classCodes) {
        if (hotkeyMapping[index1].manualCodeId === classCodes[index2].id) {
          hotkeyMapping[index1].remark = classCodes[index2].manualName
        }
      }
    }
    this.setState({ hotkeyMapping: _.cloneDeep(hotkeyMapping) })
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
      onOk: async () => {
        await deleteGroup(group.id)
        this.loadGroups()
        message.success('Delete successfully')
      }
    })
  }

  /* - - - - - - - - - - - - - - - - - - Group - - - - - - - - - - - - - - - - - -  */
  // Group修改后，保存
  onGroupOk = async () => {
    this.setState({ groupVisible: false })
    const { group } =this.state
    await updateGroup(group.id,group)
    message.success('Save successfully')
    this.loadGroups()
  }
  // 添加Group表格行
  handleInsert = () => {
    const { group } = this.state
    group.items.push({
      id:null,
      key: `Temp-${new Date().getTime()}`,
      groupId: group.id,
      productId: 'Product Id',
      stepId: 'Step Id'
    })
    this.setState({ group: _.cloneDeep(group) })
  }
  // 删除Group表格行
  handleDelete = row => {
    const { group } = this.state
    if (group.items.length > 0) {
      for (let i = 0; i < group.items.length; i++) {
        if (row === group.items[i]) {
          group.items.splice(i, 1)
          break
        }
      }
      this.setState({ group: _.cloneDeep(group) })
    }
  }
  // 保存Group表格行
  handleSave = row => {
    const { group } = this.state
    for (const i in group.items) {
      if (group.items[i].id !== null && group.items[i].id === row.id) {
        group.items[i] = row
        break
      }else{
        if(group.items[i].key !== null && group.items[i].key === row.key){
          group.items[i] = row
          break
        }
      }
    }
    this.setState({ group })
  }
  /* - - - - - - - - - - - - - - - - - - Hotkeys - - - - - - - - - - - - - - - - - -  */
  // 添加或修改热键
  onAssignHotkey = () => {
    const { hotkeyMapping, hotkey, classCode } = this.state
    const code=classCode.split('~')
    let isAdd=true
    if(hotkeyMapping.length >0){
      for(const index in hotkeyMapping){
        if(hotkeyMapping[index].hotkey === hotkey ){
          isAdd = false
          hotkeyMapping[index].manualCodeId=code[1]
          hotkeyMapping[index].remark=code[0]
        }
      }
    }
    if(isAdd){
      hotkeyMapping.push({
        hotkey:hotkey,
        manualCodeId:code[1],
        remark:code[0]
      })
    }
    this.setState({ hotkeyMapping })
  }
  // 删除热键
  onDeleteHotkey = key => {
    const { hotkeyMapping } = this.state
    for (let i = 0; i < hotkeyMapping.length; i++) {
      if (hotkeyMapping[i].hotkey === key) {
        hotkeyMapping.splice(i, 1)
        break
      }
    }
    this.setState({ hotkeyMapping })
  }
  // 保存热键
  onHotkeyOk = async () => {
    this.setState({ visible: false})
    const {hotkeyMapping,group}=this.state
    console.log("map,group",hotkeyMapping,group)
    for(const index in hotkeyMapping){
      hotkeyMapping[index].remark=null;
    }
    const updateData={
      groupId:group.id,
      hotkeys:hotkeyMapping
    }
    await updateHotkeyList(updateData)
    message.success('Hotkeys save successfully')
  }

  render() {
    const { groups, group, groupVisible, addVisible } = this.state
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
        <StyleGroupFilter>
          <Input.Search enterButton placeholder='input search text' onSearch={this.onSearch} />
          <Button type='primary' onClick={() => this.setState({ addVisible: true })}>
            Add Group
          </Button>
        </StyleGroupFilter>
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
              style={{ width: 200 }}
              onSelect={classCode => this.setState({ classCode })}
            >
              {classCodes.map(code => (
                <AutoComplete.Option key={code.id} value={code.manualCode+code.manualName +"~"+ code.id}>{`${code.manualCode} - ${code.manualName}`}</AutoComplete.Option>
              ))}
            </AutoComplete>
            <Button type='primary' size='small' onClick={this.onAssignHotkey} style={{ marginLeft: 10 }}>
              Assign
            </Button>
          </StyleHotkeys>
          <List
            itemLayout='horizontal'
            dataSource={hotkeyMapping}
            renderItem={item => (
              <List.Item actions={[<span onClick={() => this.onDeleteHotkey(item.hotkey)}>Delete</span>]}>
                {`${item.hotkey} - ${item.remark}`}
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
        <Modal
          title='Add Model Group'
          visible={addVisible}
          onOk={this.onAddGroup}
          onCancel={() => this.setState({ addVisible: false })}
        >
          <span>Group Name:</span>
          <Input style={{ width: 370, marginLeft: 10 }} onChange={e => this.setState({ addGroupName: e.target.value })} />
        </Modal>
      </StyleModelGroup>
    )
  }
}

export default ModelGroup
