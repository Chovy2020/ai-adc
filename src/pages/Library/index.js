/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Select, Modal, Breadcrumb, message, Typography } from 'antd'
const { Title } = Typography
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import {
  shareLibrary,
  delLibraryImage,
  libraryUpdate,
  addImage,
  getGroups,
  getProducts, 
  getSteps, 
  showLibrary, 
  getDefectGroups, 
  insertLibrary, 
  getDefectSteps, 
  getDefectProducts, 
  getDefectManualBin, 
  getDefectImagesList
} from './service'
import {
  StyleLibrary,
  StyleChoose,
  StyleContainer,
  StyleFooter,
  StyleImagesGroup,
  StyleImages,
  StyleDefectInfo,
  StyleImagesModal,
  StyleCodeDescription
} from './style'
const baseImageUrl = 'https://images-bucket.s3.cn-northwest-1.amazonaws.com.cn'
class Library extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      steps: [],
      groups: [],
      group: '',
      step: '',
      product: '',
      librarys: [],
      // librarys: [{libraryId: '1245223690721996800', manualCode: '', manualCodeName: '', images: []}],  // 测试数据
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
      shareLib: {
        groups: [],
        products: [],
        steps: [],
        group: '',
        step: '',
        product: ''
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
    let { createLib, shareLib, galleryRouter } = this.state
    let dg = await getDefectGroups()
    let lg = await getGroups()
    shareLib.groups = lg
    createLib.groups = JSON.parse(JSON.stringify(dg))
    galleryRouter.group.list = dg.map(item => {return {id: item.group_id, name: item.group_name}})
    this.setState({
      groups: lg,
      createLib, galleryRouter, shareLib
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
    if (!librarys || librarys.length <= 0) {
      message.warning('not find library!')
      return
    }
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
  // Create/Share Library
  onModalAddLibrary = async () => {
    let { createLib, shareLib, modalMode } = this.state
    let data = modalMode === 'CREATE' ? createLib : shareLib
    let msg = []
    if(!data.product) msg.push('Please select product ID')
    if(!data.step) msg.push('Please select step ID')
    if (!data.group) msg.push('Please select group ID')
    if (msg.length > 0) {
      message.error(msg.toString());
      return
    }
    this.setState({ visible: false })
    this.props.changeToolboxLoading(true)
    if (modalMode === 'CREATE') {
      let res = await insertLibrary({
        productId: data.product,
        stepId: data.step,
        groupId: data.group
      })
      this.props.changeToolboxLoading(false)
      message.success('Create successfully')
      this.setState({
        group: res.groupId,
        product: res.productId,
        step: res.stepId,
        librarys: [{libraryId: res.id, manualCode: '', manualCodeName: '', images: []}]
      })
    } else {
      let res = await shareLibrary({
        productId: data.product,
        stepId: data.step,
        groupId: data.group,
        destLibraryId: this.state.librarys[0].libraryId
      })
      this.props.changeToolboxLoading(false)
      message.success('shareExists success')
      this.onShowLibrary()
    }
    
  }
  onOpLibrary = (t) => {
    this.setState({ modalMode: t, visible: true })
  }

  
  // - - - - - - - - - - - - - - - - - - Gallery Images - - - - - - - - - - - - - - - - - -
  // 添加图片到library
  onGalleryModalOk = async () => {
    let { gallerySelected } = this.state
    this.setState({ galleryVisible: false })
    this.props.changeToolboxLoading(true)
    await addImage({
      libraryId: this.state.librarys[0].libraryId,
      defects: gallerySelected
    })
    gallerySelected = []
    this.setState({ gallerySelected })
    message.success('Add Success!')
    this.onShowLibrary()
    this.props.changeToolboxLoading(false)
  }
  // 删除library下的图片
  onRemoveImages = async () => {
    let { selected } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    this.props.changeToolboxLoading(true)
    await delLibraryImage({
      libraryId: this.state.librarys[0].libraryId,
      defects: selected
    })
    selected = []
    this.setState({ selected })
    this.onShowLibrary()
    message.success('Remove Success!')
    this.props.changeToolboxLoading(false)
  }

  // 根据图片refDefectId、defectPictureName、tiffFileName 判断唯一性
  // t => 重复是否删除
  getDefectImageSole = (a, b, t) => {
    let res = false
    a.map((item, ind) => {
      if (
        item.refDefectId === b.refDefectId
        && item.defectPicName === b.defectPictureName
        && item.tiffFileName === b.tiffFileName
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
    let { createLib, shareLib } = this.state
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
      case 'shareLibGroup':
        shareLib.group = id
        shareLib.products = await getProducts(id)
        shareLib.product = ''
        shareLib.steps = []
        shareLib.step = ''
        break
      case 'shareLibProduct':
        shareLib.product = id
        shareLib.steps = await getSteps(shareLib.group, id)
        shareLib.step = ''
        break
      case 'shareLibStep':
        shareLib.step = id
        break
      default:
        return
    }
    this.setState({ createLib, shareLib })
  }

  render() {
    const { groups, steps, products, visible, createLib, shareLib, editCode, selected, modalMode, galleryImages, librarys } = this.state
    const { galleryVisible, gallerySelected, galleryRouter } = this.state
    return (
      <StyleLibrary>
        <StyleChoose>
          <Title level={3}>Defect Library</Title>
          <Form layout='vertical'>
            <Form.Item>
              <Select
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
              <Button style={{ width: 120, marginLeft: 10 }} type='primary' onClick={this.onShowLibrary.bind(this)}>
                Show Library
              </Button>
              <Button style={{ width: 120 }} type='primary' onClick={this.onOpLibrary.bind(this, 'CREATE')}>
                Create Library
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
                        className={this.getDefectImageSole(selected, img) ? 'selected' : ''}
                        onClick={() => this.onGalleryImageSelect(img, 'selected')}
                      >
                        <img src={`${baseImageUrl}${img.defectPicPath}`} alt='' />
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
        <StyleFooter>
          <Button
            style={{ width: 120 }}
            disabled={librarys.length <= 0}
            type='primary'
            onClick={this.onOpLibrary.bind(this, 'SHARE')}
          >
            Share Exist
          </Button>
          <Button
            style={{ width: 120 }}
            type='primary'
            disabled={librarys.length <= 0}
            onClick={() => this.setState({ galleryVisible: true })}
          >
            Add Images
          </Button>
          <Button
            disabled={librarys.length <= 0}
            type='danger'
            onClick={this.onRemoveImages}
          >
            Remove Images
          </Button>
        </StyleFooter>
        {/* 创建Labrary */}
        <Modal
          title={modalMode === 'CREATE' ? 'Create Library' : 'Share Exist'}
          visible={visible}
          onOk={this.onModalAddLibrary}
          onCancel={() => this.setState({ visible: false })}
        >
          {
            modalMode === 'CREATE' ? (
              <Form
                style={{ width: 400, margin: '0 auto' }}
                layout='vertical'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item label='Group:'>
                  <Select
                    placeholder='Group Id'
                    style={{ width: 120 }}
                    value={createLib.group || undefined}
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
                    placeholder='Product Id'
                    style={{ width: 120 }}
                    value={createLib.product || undefined}
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
                    placeholder='Step Id'
                    style={{ width: 120 }}
                    value={createLib.step || undefined}
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
            ) : (
              <Form
                style={{ width: 400, margin: '0 auto' }}
                layout='vertical'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item label='Group:'>
                  <Select
                    placeholder='Group Id'
                    style={{ width: 120 }}
                    value={shareLib.group || undefined}
                    onChange={id => this.selectControl(id, 'shareLibGroup')}
                  >
                    {shareLib.groups.map(s => (
                      <Select.Option value={s.id} key={s.id}>
                        {s.groupName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label='Product:'>
                  <Select
                    placeholder='Product Id'
                    style={{ width: 120 }}
                    value={shareLib.product || undefined}
                    onChange={id => this.selectControl(id, 'shareLibProduct')}
                  >
                    {shareLib.products.map(s => (
                      <Select.Option value={s} key={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label='Step:'>
                  <Select
                    placeholder='Step Id'
                    style={{ width: 120 }}
                    value={shareLib.step || undefined}
                    onChange={id => this.selectControl(id, 'shareLibStep')}
                  >
                    {shareLib.steps.map(s => (
                      <Select.Option value={s} key={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            )
          }
          
        </Modal>
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
                  className={this.getDefectImageSole(gallerySelected, img) ? 'selected' : ''}
                  onClick={() => this.onGalleryImageSelect(img, 'gallerySelected')}
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
