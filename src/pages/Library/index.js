/* eslint-disable */
import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { Form, Button, Input, Select, Modal, Breadcrumb, message } from 'antd'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import { MODAL_MODES, GALLERY_IMAGES } from './constant'
import { libraryUpdate, addImage, getGroups, getProducts, getSteps, showLibrary, getDefectGroups, insertLibrary, getDefectSteps, getDefectProducts, getDefectManualBin, getDefectImagesList } from './service'
import {
  StyleLibrary,
  StyleChoose,
  StyleContainer,
  StyleImagesGroup,
  StyleImages,
  StyleDefectInfo,
  StyleImagesModal,
  StyleCodeDescription
} from './style'

class Library extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      baseImageUrl: 'https://images-bucket.s3.cn-northwest-1.amazonaws.com.cn',
      products: [],
      steps: [],
      groups: [],
      group: '',
      step: '',
      product: '',
      librarys: [],
      // create
      visible: false,
      createLib: {
        groups: [],
        products: [],
        steps: [],
        group: '',
        product: '',
        step: ''
      },
      // images
      library: [],
      selected: [], // imageIds
      editCode: '',
      modalMode: '',
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
      }
    }
  }
  // 初始化
  async componentDidMount() {
    this.props.changeMenu('library')
    let { createLib, galleryRouter } = this.state
    let dg = await getDefectGroups()
    createLib.groups = galleryRouter.group.list = JSON.parse(JSON.stringify(dg))
    galleryRouter.group.list = JSON.parse(JSON.stringify(dg)).map(item => {return {id: item.group_id, name: item.group_name}})
    this.setState({
      galleryImages: GALLERY_IMAGES,
      groups: await getGroups(),
      createLib, galleryRouter
    })
    // 获取 Product Id
    // this.onShowLibrary()
  }
  // - - - - - - - - - - - - - - - - - - Show Library - - - - - - - - - - - - - - - - - -
  onShowLibrary = async () => {
    this.setState({ librarys: [] })
    this.props.changeToolboxLoading(true)
    let {product, step, group} = this.state
    let librarys = await showLibrary({
      productId: product,
      stepId: step,
      groupId: group,
    })
    this.props.changeToolboxLoading(false)
    // library = LIBRARY.map(code => {
    //   code.expand = false
    //   return code
    // })
    this.setState({ librarys })
  }
  onDefectInfoChange = (index, key, value) => {
    const { librarys } = this.state
    librarys[index][key] = value
    this.setState({ librarys })
  }
  onDefectInfoSave = async index => {
    const { librarys, editCode } = this.state
    this.props.changeToolboxLoading(true)
    await libraryUpdate({
      libraryId: librarys[index].libraryId,
      manualCodeId: editCode,
      characterization: librarys[index].characterization,
      causeHypothesis: librarys[index].causeHypothesis
    })
    this.props.changeToolboxLoading(false)
    message.success('Save successfully')
    this.setState({ editCode: '' })
  }
  onImageSelect = id => {
    let { selected } = this.state
    if (selected.includes(id)) {
      selected = selected.filter(s => s !== id)
    } else {
      selected.push(id)
    }
    this.setState({ selected })
  }
  getCodeImagesExample = (codeImages, expand) => {
    if (codeImages && !expand && codeImages.length > 4) {
      codeImages = codeImages.filter((c, i) => i < 4)
    }
    return codeImages
  }
  onViewMoreImages = (index, expand) => {
    const { librarys } = this.state
    librarys[index].expand = expand
    this.setState({ librarys })
  }
  // - - - - - - - - - - - - - - - - - - Create Library - - - - - - - - - - - - - - - - - -
  // 创建library
  onModalAddLibrary = async () => {
    let { createLib } = this.state
    let msg = []
    if(!createLib.product) msg.push('Please select product ID')
    if(!createLib.step) msg.push('Please select step ID')
    if (!createLib.group) msg.push('Please select group ID')
    if (msg.length > 0) {
      message.error(msg.toString());
      return
    }
    this.setState({ visible: false })
    this.props.changeToolboxLoading(true)
    let data = await insertLibrary({
      productId: createLib.product,
      stepId: createLib.step,
      groupId: createLib.group
    })
    this.props.changeToolboxLoading(false)
    message.success('Create successfully')
    this.setState({
      library: [{ "code": data.id }]
    })
  }

  onCreateLibrary = () => {
    this.setState({ modalMode: MODAL_MODES[0], visible: true })
  }
  onCreateLibraryInput = (key, value = '') => {
    console.log('onCreateLibraryInput', key, value)
  }
  // - - - - - - - - - - - - - - - - - - Share Exist - - - - - - - - - - - - - - - - - -
  onShareExist = () => {
    this.setState({ modalMode: MODAL_MODES[1], visible: true })
  }

  onRemoveImages = async () => {
    const { selected } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    const { library } = this.state
    library[0].images.splice(0, 1)
    this.setState({ library })
  }
  // - - - - - - - - - - - - - - - - - - Gallery Images - - - - - - - - - - - - - - - - - -
  // 添加图片到library
  onGalleryModalOk = async () => {
    this.setState({ galleryVisible: false })
    this.props.changeToolboxLoading(true)
    await addImage({
      libraryId: this.state.librarys[0].libraryId,
      refDefectIds: this.state.gallerySelected
    })
    this.props.changeToolboxLoading(false)

    // await delay(500)
    // this.props.changeToolboxLoading(false)
    // const { galleryRouter, gallerySelected, library } = this.state
    // if (library.length === 0) return
    // const images = IMAGES_LIBRARY[galleryRouter.group][galleryRouter.product][galleryRouter.mb]
    // const selected = images.filter(img => gallerySelected.includes(img.id))
    // library[0].images = [...library[0].images, ...selected]
    // this.setState({ library })
  }

  // 图片选择
  onGalleryImageSelect = id => {
    let { gallerySelected } = this.state
    if (gallerySelected.includes(id)) {
      gallerySelected = gallerySelected.filter(s => s !== id)
    } else {
      gallerySelected.push(id)
    }
    this.setState({ gallerySelected })
  }
  // 路径选择
  onGalleryRouterClick = i => {
    const { galleryRouter } = this.state
    galleryRouter.curr = i
    if (i === 'step') {
      galleryRouter.manualBin.index = null
      galleryRouter.step.index = null
    } else if (i === 'product') {
      galleryRouter.product.index = null
      galleryRouter.step.index = null
      galleryRouter.manualBin.index = null
    } else if (i === 'group') {
      galleryRouter.group.index = null
      galleryRouter.product.index = null
      galleryRouter.step.index = null
      galleryRouter.manualBin.index = null
    }
    this.setState({ galleryRouter })
  }

  // 打开文件夹
  onGalleryFolderDbClick = async index => {
    let { galleryRouter, galleryImages } = this.state
    galleryRouter[galleryRouter.curr].index = index
    if (galleryRouter.curr === 'group') {
      let d = await getDefectProducts(galleryRouter.group.list[galleryRouter.group.index].id)
      galleryRouter.product.list = d.map(item => { return { id: item, name: item } })
      galleryRouter.product.index = null
      galleryRouter.curr = 'product'
    } else if (galleryRouter.curr === 'product') {
      let d = await getDefectSteps(galleryRouter.group.list[galleryRouter.group.index].id, galleryRouter.product.list[galleryRouter.product.index].id)
      galleryRouter.step.list = d.map(item => { return { id: item, name: item } })
      galleryRouter.step.index = null
      galleryRouter.curr = 'step'
    } else if (galleryRouter.curr === 'step') {
      let d = await getDefectManualBin(galleryRouter.group.list[galleryRouter.group.index].id, galleryRouter.product.list[galleryRouter.product.index].id, galleryRouter.step.list[galleryRouter.step.index].id)
      galleryRouter.manualBin.list = d.map(item => { return { id: item, name: item } })
      galleryRouter.manualBin.index = null
      galleryRouter.curr = 'manualBin'
    } else if (galleryRouter.curr === 'manualBin') {
      let d = await getDefectImagesList(galleryRouter.group.list[galleryRouter.group.index].id, galleryRouter.product.list[galleryRouter.product.index].id, galleryRouter.step.list[galleryRouter.step.index].id, galleryRouter.manualBin.list[galleryRouter.manualBin.index].id)
      galleryImages = d
      galleryRouter.curr = 'images'
    }
    this.setState({ galleryRouter, galleryImages })
  }

  // Group，Product，Step ID 级联选择
  async selectControl(id, type) {
    let { createLib } = this.state
    switch (type) {
      case 'group':
        this.setState({
          'group': id,
          'products': await getProducts(id),
          'product': '',
          'steps': [],
          'step': ''
        })
        break
      case 'product':
        this.setState({
          'product': id,
          'steps': await getSteps(this.state.group, id),
          'step': ''
        })
        break
      case 'step':
        this.setState({
          'step': id
        })
        break
      case 'createLibGroup':
        createLib.group = id
        createLib.products = await getDefectProducts(id)
        createLib.product = ''
        createLib.steps = []
        createLib.step = ''
        break
      case 'createLibProduct':
        createLib.product = id
        createLib.steps = await getDefectSteps(createLib.group, id)
        createLib.step = ''
        break
      case 'createLibStep':
        createLib.step = id
        break
      default:
        return
    }
    this.setState({ createLib })
  }

  render() {
    const { groups, steps, products, visible, createLib, editCode, selected, modalMode, baseImageUrl, galleryImages, librarys } = this.state
    const { galleryVisible, gallerySelected, galleryRouter } = this.state

    return (
      <StyleLibrary>
        <StyleChoose>
          <Form layout='vertical'>
            <Form.Item>
              <Select
                size='small'
                placeholder='Group Id'
                style={{ width: 120 }}
                onChange={id => this.selectControl(id, 'group')}
              >
                {groups.map(s => (
                  <Select.Option value={s.id} key={s.id}>
                    {s.groupName}
                  </Select.Option>
                ))}
              </Select>
              <Select
                size='small'
                placeholder='Product Id'
                style={{ width: 120, marginLeft: 10 }}
                value={this.state.product || undefined}
                onChange={id => this.selectControl(id, 'product')}
              >
                {products.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
              <Select
                size='small'
                placeholder='Step Id'
                style={{ width: 120, marginLeft: 10 }}
                value={this.state.step || undefined}
                onChange={id => this.selectControl(id, 'step')}
              >
                {steps.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
              <Button style={{ width: 120, marginLeft: 10 }} size='small' type='primary' onClick={this.onShowLibrary}>
                Show Library
              </Button>
            </Form.Item>
            <Form.Item>
              <Button style={{ width: 120 }} size='small' type='primary' onClick={this.onCreateLibrary}>
                Create Library
              </Button>
              <Button
                size='small'
                style={{ width: 120 }}
                disabled={librarys.length <= 0}
                type='primary'
                onClick={this.onShareExist}
              >
                Share Exist
              </Button>
              <Button
                style={{ width: 120 }}
                size='small'
                type='primary'
                disabled={librarys.length <= 0}
                onClick={() => this.setState({ galleryVisible: true })}
              >
                Add Images
              </Button>
              <Button
                disabled={librarys.length <= 0}
                style={{ width: 120 }}
                size='small'
                type='danger'
                onClick={this.onRemoveImages}
              >
                Remove Images
              </Button>
            </Form.Item>
          </Form>
        </StyleChoose>
        <StyleContainer>
          {librarys ? (
            <StyleImagesGroup>
              {librarys.map((group, index) => (
                <div key={group.manualCode}>
                  <StyleDefectInfo>
                    <span style={{ display: 'inline-block', fontWeight: 'bold', width: 240 }}>
                      【Defect Code {group.manualCode}: {(group.manualCodeName)}】: {group.images.length}
                    </span>
                    {editCode === group.manualCodeId ? (
                      <Button
                        size='small'
                        type='primary'
                        onClick={() => this.onDefectInfoSave(index)}
                        style={{ width: 40, marginLeft: 10 }}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        size='small'
                        type='primary'
                        onClick={() => this.setState({ editCode: group.manualCodeId })}
                        style={{ width: 40, marginLeft: 10 }}
                      >
                        Edit
                      </Button>
                    )}
                    {group.images.length > 4 ? (
                      <>
                        {group.expand ? (
                          <Button
                            size='small'
                            type='primary'
                            onClick={() => this.onViewMoreImages(index, false)}
                            style={{ width: 40, marginLeft: 10 }}
                          >
                            Collapse
                          </Button>
                        ) : (
                          <Button
                            size='small'
                            type='primary'
                            onClick={() => this.onViewMoreImages(index, true)}
                            style={{ width: 40, marginLeft: 10 }}
                          >
                            More
                          </Button>
                        )}
                      </>
                    ) : null}
                  </StyleDefectInfo>
                  <StyleImages className={`col6`} style={{ position: 'relative' }}>
                    {this.getCodeImagesExample(group.images, group.expand).map((img, index) => (
                      <li
                        key={index}
                        className={selected.includes(img.defectRelId) ? 'selected' : ''}
                        onClick={() => this.onImageSelect(img.defectRelId)}
                      >
                        <img src={`${baseImageUrl}${img.url}`} alt='' />
                      </li>
                    ))}
                    {!group.expand ? (
                      <StyleCodeDescription>
                        <div>
                          <h4>Characterization:</h4>
                          <Input.TextArea
                            disabled={editCode !== group.manualCodeId}
                            defaultValue={group.characterization}
                            size='small'
                            onChange={e => this.onDefectInfoChange(index, 'characterization', e.target.value)}
                          />
                        </div>
                        <div>
                          <h4>Cause/Hypothesis:</h4>
                          <Input.TextArea
                            disabled={editCode !== group.manualCodeId}
                            defaultValue={group.causeHypothesis}
                            size='small'
                            onChange={e => this.onDefectInfoChange(index, 'causeHypothesis', e.target.value)}
                          />
                        </div>
                      </StyleCodeDescription>
                    ) : null}
                  </StyleImages>
                </div>
              ))}
            </StyleImagesGroup>
          ) : null}
        </StyleContainer>
        {/* 创建Labrary */}
        <Modal
          title={modalMode}
          visible={visible}
          onOk={this.onModalAddLibrary}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form
            style={{ width: 400, margin: '0 auto' }}
            layout='vertical'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item label='Group:'>
              <Select
                size='small'
                placeholder='Group Id'
                style={{ width: 120 }}
                onChange={id => this.selectControl(id, 'createLibGroup')}
              >
                {createLib.groups.map(s => (
                  <Select.Option value={s.group_id} key={s.group_id}>
                    {s.group_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Product:'>
              <Select
                size='small'
                placeholder='Product Id'
                style={{ width: 120 }}
                value={this.state.createLib.product || undefined}
                onChange={id => this.selectControl(id, 'createLibProduct')}
              >
                {createLib.products.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Step:'>
              <Select
                size='small'
                placeholder='Step Id'
                style={{ width: 120 }}
                value={this.state.createLib.step || undefined}
                onChange={id => this.selectControl(id, 'createLibStep')}
              >
                {createLib.steps.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <StyleImagesModal
          title='Images Library'
          visible={galleryVisible}
          width={1000}
          onOk={this.onGalleryModalOk}
          onCancel={() => this.setState({ galleryVisible: false })}
        >
          <Breadcrumb separator='>'>
            <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('group')}>Home</Breadcrumb.Item>
            {
              galleryRouter.group.index !== null && (
                <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('product')}>{galleryRouter.group.list[galleryRouter.group.index].name}</Breadcrumb.Item>
              )
            }
            {
              galleryRouter.product.index !== null && (
                <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('step')}>{galleryRouter.product.list[galleryRouter.product.index].name}</Breadcrumb.Item>
              )
            }
            {
              galleryRouter.step.index !== null && (
                <Breadcrumb.Item onClick={() => this.onGalleryRouterClick('manualBin')} className={galleryRouter.curr === 'images' ? 'ant-breadcrumb-link-p' : ''}>{galleryRouter.step.list[galleryRouter.step.index].name}</Breadcrumb.Item>
              )
            }
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
                  className={gallerySelected.includes(img.refDefectId) ? 'selected' : ''}
                  onClick={() => this.onGalleryImageSelect(img.refDefectId)}
                >
                  <img src={`${baseImageUrl}${img.defectPicPath}`} alt='' />
                </li>
              ))}
            </StyleImages>
          )}
        </StyleImagesModal>
      </StyleLibrary>
    )
  }
}

injectReducer('Library', reducer)
const mapStateToProps = state => ({ ...state.Library })
const mapDispatchToProps = { changeToolboxLoading, changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(Library)
