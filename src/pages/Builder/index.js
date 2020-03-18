import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Icon,
  Tooltip,
  Button,
  Input,
  Modal,
  Form,
  AutoComplete,
  Checkbox,
  Select,
  Popover,
  Breadcrumb,
  message
} from 'antd'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
// import { getClassifyCodes } from '@/pages/Classification/service'
import reducer from './reducer'
import { PRE_TREATMENT, MODEL_TUNING, REJECT_MODEL, LIBRARY } from './constant'
import { ITEMS_LIST } from '@/pages/Classification/constant'
import { IMAGES_LIBRARY } from '@/pages/Library/constant'
import {
  StyleBuilder,
  StyleToolsGroup,
  StyleImagesContainer,
  StyleImages,
  StyleImagesModal,
  StyleModelContainer,
  StyleModelList
} from './style'

class Builder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      models: [
        {
          id: 1,
          name: 'Model_0308'
        },
        {
          id: 2,
          name: 'Model_0309'
        }
      ],
      model: '',
      createVisible: false,
      createModalName: '',
      // images
      modelMb: '',
      files: [],
      selected: [],
      // image library
      visible: false,
      galleryImages: [],
      gallerySelected: [],
      galleryRouter: {
        group: '',
        product: '',
        mb: ''
      },
      // models
      activeModel: {
        pre: [],
        tuning: [],
        reject: []
      },
      configTool: '',
      configVisible: false
    }
  }
  // 初始化
  componentDidMount() {
    this.props.changeMenu('builder')
    this.loadFiles(true)
    this.setState({ library: LIBRARY })
    // this.setState({ classifyCodes: await getClassifyCodes() })
  }
  loadFiles = async () => {
    this.setState({ files: [] })
    await delay(1)
    const { modelMb } = this.state
    const isFolder = modelMb === ''
    let files = []
    if (isFolder) {
      for (let i = 0; i < 5; i++) {
        files.push({
          id: i,
          name: 'MB-' + Math.floor(Math.random() * 279)
        })
      }
    } else {
      files = [
        {
          id: 1,
          name: 'F0004-tif-25',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-25.jpg?op=OPEN'
        },
        {
          id: 2,
          name: 'F0004-tif-26',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-26.jpg?op=OPEN'
        },
        {
          id: 3,
          name: 'F0004-tif-23',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-23.jpg?op=OPEN'
        },
        {
          id: 4,
          name: 'F0004-tif-24',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-24.jpg?op=OPEN'
        },
        {
          id: 5,
          name: 'F0004-tif-1',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-1.jpg?op=OPEN'
        },
        {
          id: 6,
          name: 'F0004-tif-2',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-2.jpg?op=OPEN'
        },
        {
          id: 11,
          name: 'F0004-tif-25',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-25.jpg?op=OPEN'
        },
        {
          id: 12,
          name: 'F0004-tif-26',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-26.jpg?op=OPEN'
        },
        {
          id: 13,
          name: 'F0004-tif-23',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-23.jpg?op=OPEN'
        },
        {
          id: 14,
          name: 'F0004-tif-24',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-24.jpg?op=OPEN'
        },
        {
          id: 15,
          name: 'F0004-tif-1',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-1.jpg?op=OPEN'
        },
        {
          id: 16,
          name: 'F0004-tif-2',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-2.jpg?op=OPEN'
        },
        {
          id: 21,
          name: 'F0004-tif-25',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-25.jpg?op=OPEN'
        },
        {
          id: 22,
          name: 'F0004-tif-26',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-26.jpg?op=OPEN'
        },
        {
          id: 23,
          name: 'F0004-tif-23',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-23.jpg?op=OPEN'
        },
        {
          id: 24,
          name: 'F0004-tif-24',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-24.jpg?op=OPEN'
        },
        {
          id: 25,
          name: 'F0004-tif-1',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-1.jpg?op=OPEN'
        },
        {
          id: 26,
          name: 'F0004-tif-2',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-2.jpg?op=OPEN'
        },
        {
          id: 123,
          name: 'F0004-tif-23',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-23.jpg?op=OPEN'
        },
        {
          id: 124,
          name: 'F0004-tif-24',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-24.jpg?op=OPEN'
        },
        {
          id: 125,
          name: 'F0004-tif-1',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-1.jpg?op=OPEN'
        },
        {
          id: 126,
          name: 'F0004-tif-2',
          url: '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-2.jpg?op=OPEN'
        }
      ]
    }
    this.setState({ files })
  }
  // Load Model
  onModelChange = async modelName => {
    // call api
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    this.setState({
      model: modelName,
      modelMb: '',
      selected: []
    })
    this.loadFiles(true)
  }
  // Load Template
  onTemplateChange = () => {
    this.setState({ createVisible: true })
  }
  onCreateModalOk = async () => {
    this.setState({ createVisible: false })
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    const { createModalName } = this.state
    this.setState({
      model: createModalName,
      modelMb: '',
      selected: []
    })
    // call api
    this.loadFiles(true)
  }
  // - - - - - - - - - - - - - - - - - - Images - - - - - - - - - - - - - - - - - -
  onModelToHome = i => {
    this.loadFiles()
    // 清空已选择的图片，不允许跨文件夹多选
    this.setState({ modelMb: '', selected: [] })
  }
  // 双击打开文件夹
  onFolderDbClick = modelMb => {
    // 打开Manual Bin, 展示图片
    this.setState({ modelMb })
    this.loadFiles(false)
  }
  // 选择图片
  onImageSelect = id => {
    let { selected } = this.state
    if (selected.includes(id)) {
      selected = selected.filter(s => s !== id)
    } else {
      selected.push(id)
    }
    this.setState({ selected })
  }
  // 删除图片
  onRemoveImages = () => {
    const { selected } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    // call api
    this.setState({ selected: [] })
    message.success('Remove completed')
  }
  // - - - - - - - - - - - - - - - - - - Add Images Modal - - - - - - - - - - - - - - - - - -
  onModalOk = () => {
    message.success('Add succeeded')
    this.setState({ visible: false })
  }
  onLibraryImageSelect = id => {
    let { librarySelected } = this.state
    if (librarySelected.includes(id)) {
      librarySelected = librarySelected.filter(s => s !== id)
    } else {
      librarySelected.push(id)
    }
    this.setState({ librarySelected })
  }
  // - - - - - - - - - - - - - - - - - - Model - - - - - - - - - - - - - - - - - -
  onToolAdd = (type, tool) => {
    const { activeModel } = this.state
    activeModel[type].push({
      id: Math.floor(Math.random() * 1000000),
      name: tool.name,
      icon: tool.icon
    })
    this.setState({ activeModel })
  }
  onToolRemove = (type, toolId) => {
    const { activeModel } = this.state
    activeModel[type] = activeModel[type].filter(m => m.id !== toolId)
    this.setState({ activeModel })
  }
  onToolEdit = (type, tool) => {
    this.setState({ configVisible: true, configTool: tool.name })
  }
  onConfigModalOk = () => {
    this.setState({ configVisible: false })
    // configTool应记录id
    const { activeModel, configTool } = this.state
    for (const key in activeModel) {
      for (const model of activeModel[key]) {
        // 通过唯一id确定，同类型的tool会重复
        if (model.name === configTool) {
          model.config = {}
        }
      }
    }
    this.setState({ activeModel })
  }
  onModelSave = () => {
    message.success('Save successfully')
  }
  onModelSaveAs = () => {
    // 弹出层 选择groupId和输入modelName
    this.setState({ createVisible: true })
  }
  // - - - - - - - - - - - - - - - - - - Gallery Images - - - - - - - - - - - - - - - - - -
  onGalleryImageSelect = id => {
    let { gallerySelected } = this.state
    if (gallerySelected.includes(id)) {
      gallerySelected = gallerySelected.filter(s => s !== id)
    } else {
      gallerySelected.push(id)
    }
    this.setState({ gallerySelected })
  }
  onGalleryModalOk = async () => {
    this.setState({ visible: false })
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    this.loadFiles()
    const { gallerySelected } = this.state
    if (gallerySelected.length === 0) return
    console.log('gallerySelected', gallerySelected)
  }
  onGalleryRouterClick = i => {
    const { galleryRouter } = this.state
    if (i === 0) {
      galleryRouter.group = ''
      galleryRouter.product = ''
      galleryRouter.mb = ''
    } else if (i === 1) {
      galleryRouter.product = ''
      galleryRouter.mb = ''
    } else if (i === 2) {
      galleryRouter.mb = ''
    }
    this.setState({ galleryRouter })
  }
  onGalleryFolderDbClick = folder => {
    const { galleryRouter } = this.state
    if (galleryRouter.mb !== '') {
      message.error('error')
    } else if (galleryRouter.product !== '') {
      galleryRouter.mb = folder
    } else if (galleryRouter.group !== '') {
      galleryRouter.product = folder
    } else {
      galleryRouter.group = folder
    }
    this.setState({ galleryRouter })
  }
  getFolderList = () => {
    const { galleryRouter } = this.state
    if (galleryRouter.mb !== '') {
      return null
    } else if (galleryRouter.product !== '') {
      return Object.keys(IMAGES_LIBRARY[galleryRouter.group][galleryRouter.product])
    } else if (galleryRouter.group !== '') {
      return Object.keys(IMAGES_LIBRARY[galleryRouter.group])
    } else {
      return Object.keys(IMAGES_LIBRARY)
    }
  }

  render() {
    const { models, model, modelMb, files, selected } = this.state
    const { visible, gallerySelected, galleryRouter } = this.state
    const folderList = this.getFolderList()

    const { activeModel, configVisible, configTool, createVisible } = this.state
    const isFolder = modelMb === ''

    return (
      <StyleBuilder>
        <Row>
          <Col span={3} style={{ padding: 10, borderRight: '1px solid #ccc' }}>
            <h2>Utilization</h2>
            <StyleToolsGroup>
              <h4>Pre-Treatment</h4>
              <ul>
                {PRE_TREATMENT.map(m => (
                  <li key={m.name}>
                    <Tooltip placement='topLeft' title={m.name}>
                      <Icon onClick={() => this.onToolAdd('pre', m)} theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <h4>Model Tuning</h4>
              <ul>
                {MODEL_TUNING.map(m => (
                  <li key={m.name}>
                    <Tooltip placement='topLeft' title={m.name}>
                      <Icon onClick={() => this.onToolAdd('tuning', m)} theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <h4>Reject Model</h4>
              <ul>
                {REJECT_MODEL.map(m => (
                  <li key={m.name}>
                    <Tooltip placement='topLeft' title={m.name}>
                      <Icon onClick={() => this.onToolAdd('reject', m)} theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </StyleToolsGroup>
          </Col>
          <Col span={21} style={{ padding: 10 }}>
            <Popover
              content={
                <Select style={{ width: 120 }} defaultValue={model} onChange={this.onModelChange}>
                  {models.map(m => (
                    <Select.Option key={m.id} value={m.name}>
                      {m.name}
                    </Select.Option>
                  ))}
                </Select>
              }
            >
              <Button type='primary'>Load Model</Button>
            </Popover>
            <Popover
              content={
                <Select style={{ width: 120 }} defaultValue={model} onChange={this.onTemplateChange}>
                  {models.map(m => (
                    <Select.Option key={m.id} value={m.id}>
                      {m.name}
                    </Select.Option>
                  ))}
                </Select>
              }
            >
              <Button type='primary'>Load Template \& Create</Button>
            </Popover>
            <span style={{ marginLeft: 20 }}>{model}</span>
            <StyleImagesContainer>
              <Button size='small' onClick={() => this.setState({ visible: true })}>
                Add Image
              </Button>
              <Button size='small' type='danger' onClick={this.onRemoveImages}>
                Remove Image
              </Button>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item onClick={this.onModelToHome}>Home</Breadcrumb.Item>
                {modelMb !== '' ? <Breadcrumb.Item>{modelMb}</Breadcrumb.Item> : null}
              </Breadcrumb>
              <StyleImages className={isFolder ? 'gallery' : 'images'} style={{ overflowY: 'auto', maxHeight: 240 }}>
                {isFolder ? (
                  <>
                    {files.map(folder => (
                      <li key={folder.id} onDoubleClick={() => this.onFolderDbClick(folder.name)}>
                        <img src={Folder} alt='' />
                        <p>{folder.name}</p>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {files.map(img => (
                      <li
                        key={img.id}
                        className={selected.includes(img.id) ? 'selected' : ''}
                        onClick={() => this.onImageSelect(img.id)}
                      >
                        <img src={isFolder ? Folder : `http://161.189.50.41${img.url}`} alt='' />
                      </li>
                    ))}
                  </>
                )}
              </StyleImages>
            </StyleImagesContainer>

            <StyleModelContainer>
              <Row>
                <Col span={6} className='model-block'>
                  <h4>Pre-Treatment</h4>
                  <StyleModelList>
                    {activeModel.pre.map(m => (
                      <li key={m.id}>
                        <Popover
                          placement='right'
                          content={
                            <>
                              <Button
                                type='primary'
                                shape='circle'
                                icon='edit'
                                onClick={() => this.onToolEdit('pre', m)}
                              />
                              <Button
                                type='danger'
                                shape='circle'
                                icon='delete'
                                onClick={() => this.onToolRemove('pre', m.id)}
                              />
                            </>
                          }
                        >
                          <Button
                            type='primary'
                            className={m.config ? 'config' : ''}
                            onDoubleClick={() => this.onToolEdit('pre', m)}
                          >
                            <Icon type={m.icon} />
                            {m.name}
                            {m.config ? <Icon type='check' /> : null}
                          </Button>
                        </Popover>
                      </li>
                    ))}
                  </StyleModelList>
                </Col>
                <Col span={2} className='model-icon'>
                  <Icon type='arrow-right' />
                </Col>
                <Col span={6} className='model-block'>
                  <h4>Model Tuning</h4>
                  <StyleModelList>
                    {activeModel.tuning.map(m => (
                      <li key={m.id}>
                        <Popover
                          placement='right'
                          content={
                            <>
                              <Button
                                type='primary'
                                shape='circle'
                                icon='edit'
                                onClick={() => this.onToolEdit('tuning', m)}
                              />
                              <Button
                                type='danger'
                                shape='circle'
                                icon='delete'
                                onClick={() => this.onToolRemove('tuning', m.id)}
                              />
                            </>
                          }
                        >
                          <Button
                            type='primary'
                            className={m.config ? 'config' : ''}
                            onDoubleClick={() => this.onToolEdit('tuning', m)}
                          >
                            <Icon type={m.icon} />
                            {m.name}
                            {m.config ? <Icon type='check' /> : null}
                          </Button>
                        </Popover>
                      </li>
                    ))}
                  </StyleModelList>
                </Col>
                <Col span={2} className='model-icon'>
                  <Icon type='arrow-right' />
                </Col>
                <Col span={6} className='model-block'>
                  <h4>Reject Model</h4>
                  <StyleModelList>
                    {activeModel.reject.map(m => (
                      <li key={m.id}>
                        <Popover
                          placement='right'
                          content={
                            <>
                              <Button
                                type='primary'
                                shape='circle'
                                icon='edit'
                                onClick={() => this.onToolEdit('reject', m)}
                              />
                              <Button
                                type='danger'
                                shape='circle'
                                icon='delete'
                                onClick={() => this.onToolRemove('reject', m.id)}
                              />
                            </>
                          }
                        >
                          <Button
                            type='primary'
                            className={m.config ? 'config' : ''}
                            onDoubleClick={() => this.onToolEdit('reject', m)}
                          >
                            <Icon type={m.icon} />
                            {m.name}
                            {m.config ? <Icon type='check' /> : null}
                          </Button>
                        </Popover>
                      </li>
                    ))}
                  </StyleModelList>
                </Col>
              </Row>
              <div style={{ padding: '10px 0' }}>
                <Link to='/config'>
                  <Button type='primary'>Training</Button>
                </Link>
                <Link to='/reporting' style={{ margin: '0 10px' }}>
                  <Button type='primary'>View Result</Button>
                </Link>
                <Button onClick={this.onModelSave} type='primary'>
                  Save
                </Button>
                <Button onClick={this.onModelSaveAs} type='primary'>
                  Save As
                </Button>
              </div>
            </StyleModelContainer>
          </Col>
        </Row>

        <StyleImagesModal
          title='Images Library'
          visible={visible}
          width={1000}
          onOk={this.onGalleryModalOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Breadcrumb separator='>'>
            <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(0)}>Home</Breadcrumb.Item>
            {galleryRouter.group !== '' ? (
              <>
                <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(1)}>{galleryRouter.group}</Breadcrumb.Item>
                {galleryRouter.product ? (
                  <>
                    <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(2)}>
                      {galleryRouter.product}
                    </Breadcrumb.Item>
                    {galleryRouter.mb ? <Breadcrumb.Item>{galleryRouter.mb}</Breadcrumb.Item> : null}
                  </>
                ) : null}
              </>
            ) : null}
          </Breadcrumb>
          {folderList ? (
            <StyleImages className='gallery'>
              {folderList.map(folder => (
                <li key={folder} onDoubleClick={() => this.onGalleryFolderDbClick(folder)}>
                  <img src={Folder} alt='' />
                  <p>{folder}</p>
                </li>
              ))}
            </StyleImages>
          ) : (
            <StyleImages className='gallery images'>
              {IMAGES_LIBRARY[galleryRouter.group][galleryRouter.product][galleryRouter.mb].map((img, index) => (
                <li
                  key={img.id}
                  className={gallerySelected.includes(img.id) ? 'selected' : ''}
                  onClick={() => this.onGalleryImageSelect(img.id)}
                >
                  <img src={`http://161.189.50.41${img.url}`} alt='' />
                </li>
              ))}
            </StyleImages>
          )}
        </StyleImagesModal>

        <Modal
          title={'Model Config - ' + configTool}
          visible={configVisible}
          onOk={this.onConfigModalOk}
          onCancel={() => this.setState({ configVisible: false })}
        >
          <Form
            style={{ width: 400, margin: '0 auto' }}
            layout='vertical'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item label='Zoom:'>
              <Select
                size='small'
                placeholder='Step Id'
                style={{ width: 120, marginLeft: 10 }}
                onChange={group => this.setState({ group })}
              >
                {['aaa', 'bbb', 'ccc'].map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Width:'>
              <AutoComplete
                allowClear
                size='small'
                filterOption={true}
                dataSource={['2', '222', '221', '2333']}
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item label='Includes:'>
              <Checkbox.Group options={ITEMS_LIST} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={'Create Model'}
          visible={createVisible}
          onOk={this.onCreateModalOk}
          onCancel={() => this.setState({ createVisible: false })}
        >
          <Form
            style={{ width: 400, margin: '0 auto' }}
            layout='vertical'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item label='Group Id:'>
              <Select
                size='small'
                placeholder='Step Id'
                style={{ width: 120, marginLeft: 10 }}
                onChange={group => this.setState({ group })}
              >
                {['aaa', 'bbb', 'ccc'].map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Model Name:'>
              <Input
                onChange={e => this.setState({ createModalName: e.target.value })}
                placeholder='Please input model name'
              />
            </Form.Item>
          </Form>
        </Modal>
      </StyleBuilder>
    )
  }
}

injectReducer('Builder', reducer)
const mapStateToProps = state => ({ ...state.Builder })
const mapDispatchToProps = { changeToolboxLoading, changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(Builder)
