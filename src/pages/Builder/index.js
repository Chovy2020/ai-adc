import React from 'react'
import _ from 'lodash'
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
  InputNumber,
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
import {
  getStages,
  getModels,
  getModel,
  getModelImages,
  removeImagesFromModel,
  getDefectGroups,
  getDefectProducts,
  getDefectSteps,
  getDefectManualBin,
  getDefectImagesList
} from './service'
import { LIBRARY, TOOL_STAGES, TOOL_CONFIG_STEP } from './constant'
import { IMAGES_LIBRARY } from '@/pages/Library/constant'
import {
  StyleBuilder,
  StyleToolsGroup,
  StyleImagesContainer,
  StyleImages,
  StyleImagesModal,
  StyleModelContainer,
  StyleModelList,
  StyleTool,
  StyleFooter
} from './style'

class Builder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stages: [],
      models: [],
      model: {},
      modelName: '',
      // images
      modelMb: '',
      files: [],
      selected: [],
      // add images
      galleryVisible: false,
      galleryImages: [],
      gallerySelected: [],
      galleryRouter: {
        curr: 'group',
        group: {
          list: [],
          index: null
        },
        product: {
          list: [],
          index: null
        },
        step: {
          list: [],
          index: null
        },
        manualBin: {
          list: [],
          index: null
        }
      },
      // models
      activeTools: {
        PRE: [],
        TUNING: [],
        REJECT: []
      },
      configTool: {
        params: []
      },
      configVisible: false
    }
  }
  // 初始化
  componentDidMount() {
    this.props.changeMenu('builder')
    this.loadFiles(true)
    this.setState({ library: LIBRARY })
    this.loadStages()
    this.loadModels()
    this.loadGalleryFolder()
    // this.setState({ classifyCodes: await getClassifyCodes() })
  }
  // 加载gallery目录
  loadGalleryFolder = async () => {
    const dg = await getDefectGroups()
    const { galleryRouter } = this.state
    galleryRouter.group.list = dg.map(item => {
      return { id: item.group_id, name: item.group_name }
    })
    this.setState({ galleryRouter })
  }
  // 加载模型列表
  loadModels = async () => {
    const res = await getModels()
    const models = []
    const templates = []
    for (const index in res) {
      if (res[index].isProductPlugin === 'Y') {
        templates.push(res[index])
      } else {
        models.push(res[index])
      }
    }
    this.setState({ models, templates })
  }
  // 加载左侧的模型工具
  loadStages = async () => {
    const stages = await getStages()
    this.setState({ stages })
  }
  loadFiles = async () => {
    this.setState({ files: [] })

    await delay(1)
    const { modelMb, model } = this.state
    const isFolder = modelMb === ''
    let files = []
    if (isFolder) {
      for (const index in model.manualBins) {
        files.push({
          id: model.manualBins[index],
          name: 'MB-' + model.manualBins[index]
        })
      }
    } else {
      files = await getModelImages(model.id, modelMb)
    }
    this.setState({ files })
  }
  // Load Model
  onModelChange = async modelId => {
    // call api
    const res = await getModel(modelId)
    res.id = modelId
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    this.setState({
      modelName: res.modelName,
      model: res,
      modelMb: '',
      selected: []
    })
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
  onRemoveImages = async () => {
    const { selected, model } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    const data = {
      modelId: model.id,
      refDefectIds: selected
    }
    console.log('delet--', data)
    await removeImagesFromModel(data)
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
  onToolAdd = (stage, tool) => {
    const { activeTools } = this.state
    activeTools[stage].push({
      key: Math.floor(Math.random() * 1000000),
      ...tool
    })
    this.setState({ activeTools })
  }
  onToolRemove = (stage, toolKey) => {
    const { activeTools } = this.state
    activeTools[stage] = activeTools[stage].filter(tool => tool.key !== toolKey)
    this.setState({ activeTools })
  }
  onToolEdit = tool => {
    this.setState({ configVisible: true, configTool: _.cloneDeep(tool) })
  }
  // Config Params 输入
  onToolConfigParamsChange = (paramId, paramType, value) => {
    const { configTool } = this.state
    for (const i in configTool.params) {
      if (configTool.params[i].id === paramId) {
        if (paramType === 'VAL') {
          configTool.params[i].value = value
        } else if (paramType === 'NUM0') {
          configTool.params[i].number0 = value
        } else if (paramType === 'NUM1') {
          configTool.params[i].number1 = value
        }
        break
      }
    }
    this.setState({ configTool })
  }
  onConfigModalOk = () => {
    this.setState({ configVisible: false })
    // configTool应记录id
    const { activeTools, configTool } = this.state
    for (const s in activeTools) {
      for (const i in activeTools[s]) {
        // 通过唯一id确定，同类型的tool会重复
        if (activeTools[s][i].key === configTool.key) {
          activeTools[s][i] = _.cloneDeep(configTool)
          activeTools[s][i].config = 1
          break
        }
      }
    }
    this.setState({ activeTools })
  }
  onModelSave = () => {
    message.success('Save successfully')
  }
  onModelSaveAs = () => {
    // 弹出层 选择groupId和输入modelName
    this.setState({ createVisible: true })
  }
  onViewResult = () => {
    const { history } = this.props
    console.log(history)
    history.push('/reporting', { modelId: 'abc123' })
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
  // 路径选择
  onGalleryRouterClick = i => {
    const { galleryRouter } = this.state
    galleryRouter.curr = i
    if (i === 'step') {
      galleryRouter.step.index = null
    } else if (i === 'product') {
      galleryRouter.product.index = null
      galleryRouter.step.index = null
    } else if (i === 'group') {
      galleryRouter.group.index = null
      galleryRouter.product.index = null
      galleryRouter.step.index = null
    }
    galleryRouter.manualBin.index = null
    this.setState({ galleryRouter })
  }
  // 打开文件夹
  onGalleryFolderDbClick = async index => {
    let { galleryRouter, galleryImages } = this.state
    galleryRouter[galleryRouter.curr].index = index
    if (galleryRouter.curr === 'group') {
      let d = await getDefectProducts(galleryRouter.group.list[galleryRouter.group.index].id)
      galleryRouter.product.list = d.map(item => {
        return { id: item, name: item }
      })
      galleryRouter.product.index = null
      galleryRouter.curr = 'product'
    } else if (galleryRouter.curr === 'product') {
      let d = await getDefectSteps(
        galleryRouter.group.list[galleryRouter.group.index].id,
        galleryRouter.product.list[galleryRouter.product.index].id
      )
      galleryRouter.step.list = d.map(item => {
        return { id: item, name: item }
      })
      galleryRouter.step.index = null
      galleryRouter.curr = 'step'
    } else if (galleryRouter.curr === 'step') {
      let d = await getDefectManualBin(
        galleryRouter.group.list[galleryRouter.group.index].id,
        galleryRouter.product.list[galleryRouter.product.index].id,
        galleryRouter.step.list[galleryRouter.step.index].id
      )
      galleryRouter.manualBin.list = d.map(item => {
        return { id: item, name: item }
      })
      galleryRouter.manualBin.index = null
      galleryRouter.curr = 'manualBin'
    } else if (galleryRouter.curr === 'manualBin') {
      let d = await getDefectImagesList(
        galleryRouter.group.list[galleryRouter.group.index].id,
        galleryRouter.product.list[galleryRouter.product.index].id,
        galleryRouter.step.list[galleryRouter.step.index].id,
        galleryRouter.manualBin.list[galleryRouter.manualBin.index].id
      )
      galleryImages = d
      galleryRouter.curr = 'images'
    }
    this.setState({ galleryRouter, galleryImages })
  }
  // 根据图片refDefectId、defectPictureName、tiffFileName 判断唯一性
  // t => 重复是否删除
  getDefectImageSole = (a, b, t) => {
    let res = false
    a.forEach((item, ind) => {
      if (
        item.refDefectId === b.refDefectId &&
        item.defectPicName === b.defectPictureName &&
        item.tiffFileName === b.tiffFileName
      ) {
        res = true
        t && a.splice(ind, 1)
      }
    })
    return res
  }
  // ------ 图片选择 ------
  // t => 'gallerySelected' 文件夹内图片
  // t => 'selected' library内图片
  onGalleryImageSelect = (img, t) => {
    let data = this.state[t]
    if (this.getDefectImageSole(data, img)) {
      this.getDefectImageSole(data, img, true)
    } else {
      data.push({
        refDefectId: img.refDefectId,
        defectPicName: img.defectPictureName,
        tiffFileName: img.tiffFileName
      })
    }
    t === 'gallerySelected' ? this.setState({ gallerySelected: data }) : this.setState({ selected: data })
  }
  // 添加图片到Model
  onGalleryModalOk = async () => {
    const { gallerySelected } = this.state
    this.setState({ galleryVisible: false })
    console.log('gallerySelected', gallerySelected)
    this.setState({ gallerySelected: [] })
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
    const { models, modelName, modelMb, files, selected, stages } = this.state
    const { galleryVisible, galleryImages, gallerySelected, galleryRouter } = this.state
    // const folderList = this.getFolderList()

    const { activeTools, configVisible, configTool } = this.state
    const isFolder = modelMb === ''

    return (
      <StyleBuilder>
        <Row>
          <Col span={3} style={{ padding: 10, borderRight: '1px solid #ccc' }}>
            <h2>Utilization</h2>
            <StyleToolsGroup>
              {stages.map(stage => (
                <React.Fragment key={stage.id}>
                  <h4>{stage.stageName}</h4>
                  <ul>
                    {stage.tools.map(tool => (
                      <li key={tool.id}>
                        <Tooltip placement='topLeft' title={tool.toolName}>
                          <img
                            onClick={() => this.onToolAdd(stage.stageCode, tool)}
                            src={`${window.ICON_BASE_URL}${tool.toolCode}.png`}
                            alt=''
                          />
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              ))}
            </StyleToolsGroup>
          </Col>
          <Col span={21} style={{ padding: 10 }}>
            <Popover
              content={
                <Select style={{ width: 120 }} defaultValue={modelName} onChange={this.onModelChange}>
                  {models.map(m => (
                    <Select.Option key={m.id} value={m.id}>
                      {m.modelName}
                    </Select.Option>
                  ))}
                </Select>
              }
            >
              <Button type='primary'>Load Model</Button>
            </Popover>

            <span style={{ marginLeft: 20 }}>{modelName}</span>
            <StyleImagesContainer>
              <Button size='small' onClick={() => this.setState({ galleryVisible: true })}>
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
                      <li key={folder.id} onDoubleClick={() => this.onFolderDbClick(folder.id)}>
                        <img src={Folder} alt='' />
                        <p>{folder.name}</p>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {files.map((img, index) => (
                      <li
                        key={index}
                        className={selected.includes(img.refDefectId) ? 'selected' : ''}
                        onClick={() => this.onImageSelect(img.refDefectId)}
                      >
                        <img src={isFolder ? Folder : `${window.BASE_URL}${img.url}`} alt='' />
                      </li>
                    ))}
                  </>
                )}
              </StyleImages>
            </StyleImagesContainer>

            <StyleModelContainer>
              <Row>
                {TOOL_STAGES.map((stage, index) => (
                  <React.Fragment key={stage}>
                    {index > 0 ? (
                      <Col span={1} className='model-icon'>
                        <Icon type='arrow-right' />
                      </Col>
                    ) : null}
                    <Col span={7} className='model-block'>
                      <h4>Pre-Treatment</h4>
                      <StyleModelList>
                        {activeTools[stage].map(tool => (
                          <li key={tool.key}>
                            <Popover
                              placement='right'
                              content={
                                <>
                                  <Button
                                    type='primary'
                                    shape='circle'
                                    icon='edit'
                                    onClick={() => this.onToolEdit(tool)}
                                  />
                                  <Button
                                    type='danger'
                                    shape='circle'
                                    icon='delete'
                                    onClick={() => this.onToolRemove(stage, tool.key)}
                                  />
                                </>
                              }
                            >
                              <StyleTool onDoubleClick={() => this.onToolEdit(tool)}>
                                <img src={`${window.ICON_BASE_URL}${tool.toolCode}.png`} alt='' />
                                <p>{tool.toolName}</p>
                                {tool.config ? <span className='config'></span> : null}
                              </StyleTool>
                            </Popover>
                          </li>
                        ))}
                      </StyleModelList>
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
            </StyleModelContainer>
          </Col>
        </Row>

        {modelName !== '' ? (
          <StyleFooter>
            <Link to='/config'>
              <Button type='primary'>Training</Button>
            </Link>
            <Link to='/reporting' style={{ margin: '0 10px' }}>
              <Button type='primary'>View Result</Button>
            </Link>
            <Button type='primary' onClick={this.onViewResult}>
              View Result
            </Button>
            <Button onClick={this.onModelSave} type='primary'>
              Save
            </Button>
            <Button onClick={this.onModelSaveAs} type='primary'>
              Save As
            </Button>
          </StyleFooter>
        ) : null}

        {/* 图片文件夹 */}
        <StyleImagesModal
          title='Images Library'
          visible={galleryVisible}
          width={1000}
          onOk={this.onGalleryModalOk}
          onCancel={() => this.setState({ galleryVisible: false })}
        >
          <Breadcrumb separator='>'>
            <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('group')}>Home</Breadcrumb.Item>
            {galleryRouter.group.index !== null && (
              <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('product')}>
                {galleryRouter.group.list[galleryRouter.group.index].name}
              </Breadcrumb.Item>
            )}
            {galleryRouter.product.index !== null && (
              <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('step')}>
                {galleryRouter.product.list[galleryRouter.product.index].name}
              </Breadcrumb.Item>
            )}
            {galleryRouter.step.index !== null && (
              <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('manualBin')}>
                {galleryRouter.step.list[galleryRouter.step.index].name}
              </Breadcrumb.Item>
            )}
            {galleryRouter.manualBin.index !== null && (
              <Breadcrumb.Item>{galleryRouter.manualBin.list[galleryRouter.manualBin.index].name}</Breadcrumb.Item>
            )}
          </Breadcrumb>
          {galleryRouter.curr !== 'images' ? (
            <StyleImages className='gallery'>
              {galleryRouter[galleryRouter.curr].list.map((item, index) => (
                <li key={item.id} onDoubleClick={() => this.onGalleryFolderDbClick(index)}>
                  <img src={Folder} alt='' />
                  <p>{item.name}</p>
                </li>
              ))}
            </StyleImages>
          ) : (
            <StyleImages className='gallery images'>
              {galleryImages.map((img, ind) => (
                <li
                  key={ind}
                  className={this.getDefectImageSole(gallerySelected, img) ? 'selected' : ''}
                  onClick={() => this.onGalleryImageSelect(img, 'gallerySelected')}
                >
                  <img src={`${window.BASE_URL}${img.defectPicPath}`} alt='' />
                </li>
              ))}
            </StyleImages>
          )}
        </StyleImagesModal>

        <Modal
          title={`Model Config - ${configTool.toolName || ''}`}
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
            {configTool.params.map(param => (
              <Form.Item key={param.id} required={param.isRequired} label={`${param.paramName}:`}>
                {param.dataType === 'string' ? (
                  <>
                    <Input
                      onChange={e => this.onToolConfigParamsChange(param.id, 'STR', e.target.value)}
                      defaultValue={param.valueDefault}
                      size='small'
                    />
                  </>
                ) : (
                  <>
                    <InputNumber
                      onChange={v => this.onToolConfigParamsChange(param.id, 'NUM0', v)}
                      min={param.lowerLimit}
                      max={param.upperLimit}
                      step={TOOL_CONFIG_STEP}
                      defaultValue={param.lowerLimitDefault}
                      size='small'
                    />
                    {param.paramType === 'SCOPE' ? (
                      <InputNumber
                        onChange={v => this.onToolConfigParamsChange(param.id, 'NUM1', v)}
                        style={{ marginLeft: 20 }}
                        min={param.lowerLimit}
                        max={param.upperLimit}
                        step={TOOL_CONFIG_STEP}
                        defaultValue={param.upperLimitDefault}
                        size='small'
                      />
                    ) : null}
                  </>
                )}
              </Form.Item>
            ))}
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
