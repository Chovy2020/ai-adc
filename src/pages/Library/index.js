import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { Form, Button, Input, Select, AutoComplete, Modal, Breadcrumb, message } from 'antd'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import { MODAL_MODES, LIBRARY, GALLERY_IMAGES, IMAGES_LIBRARY } from './constant'
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
      groups: ['1', '2', '3'],
      group: '1',
      // create
      visible: false,
      createLib: {
        group: '',
        product: '',
        step: ''
      },
      // images
      library: null,
      selected: [], // imageIds
      editCode: '',
      modalMode: '',
      // add images
      galleryVisible: false,
      galleryImages: [],
      gallerySelected: [],
      galleryRouter: {
        group: '',
        product: '',
        mb: ''
      }
    }
  }
  // 初始化
  componentDidMount() {
    this.setState({ galleryImages: GALLERY_IMAGES })
    // this.onShowLibrary()
  }
  // - - - - - - - - - - - - - - - - - - Show Library - - - - - - - - - - - - - - - - - -
  onShowLibrary = async () => {
    this.setState({ library: [] })
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    const library = LIBRARY.map(code => {
      code.expand = false
      return code
    })
    this.setState({ library })
  }
  onDefectInfoChange = (index, key, value) => {
    const { library } = this.state
    library[index][key] = value
    this.setState({ library })
  }
  onDefectInfoSave = index => {
    // const { library } = this.state
    // const { characterization, causeHypothesis } = library[index]
    // console.log('code:', library[index].code, characterization, causeHypothesis)
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
    if (!expand && codeImages.length > 4) {
      codeImages = codeImages.filter((c, i) => i < 4)
    }
    return codeImages
  }
  onViewMoreImages = (index, expand) => {
    const { library } = this.state
    library[index].expand = expand
    this.setState({ library })
  }
  // - - - - - - - - - - - - - - - - - - Create Library - - - - - - - - - - - - - - - - - -
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
  onModalOk = async () => {
    this.setState({ visible: false })
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    const { modalMode } = this.state
    if (modalMode === MODAL_MODES[0]) {
      this.setState({ library: [] })
    } else if (modalMode === MODAL_MODES[1]) {
      this.setState({ library: LIBRARY })
    }
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
    this.setState({ galleryVisible: false })
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    const { galleryRouter, gallerySelected, library } = this.state
    if (library.length === 0) return
    const images = IMAGES_LIBRARY[galleryRouter.group][galleryRouter.product][galleryRouter.mb]
    const selected = images.filter(img => gallerySelected.includes(img.id))
    library[0].images = [...library[0].images, ...selected]
    this.setState({ library })
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
    const { groups, visible, createLib, library, editCode, selected, modalMode } = this.state
    const { galleryVisible, gallerySelected, galleryRouter } = this.state
    const folderList = this.getFolderList()

    return (
      <StyleLibrary>
        <StyleChoose>
          <Form layout='vertical'>
            <Form.Item>
              <Select
                size='small'
                placeholder='Product Id'
                style={{ width: 120 }}
                onChange={group => this.setState({ group })}
              >
                {groups.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
              <Select
                size='small'
                placeholder='Step Id'
                style={{ width: 120, marginLeft: 10 }}
                onChange={group => this.setState({ group })}
              >
                {groups.map(s => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
              <Select
                size='small'
                placeholder='Group Id'
                style={{ width: 120, marginLeft: 10 }}
                onChange={group => this.setState({ group })}
              >
                {groups.map(s => (
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
                disabled={!library || library.length > 0}
                type='primary'
                onClick={this.onShareExist}
              >
                Share Exist
              </Button>
              <Button
                style={{ width: 120 }}
                size='small'
                type='primary'
                disabled={!library}
                onClick={() => this.setState({ galleryVisible: true })}
              >
                Add Images
              </Button>
              <Button
                disabled={!library}
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
          {library ? (
            <StyleImagesGroup>
              {library.map((group, index) => (
                <div key={group.code}>
                  <StyleDefectInfo>
                    <span style={{ display: 'inline-block', fontWeight: 'bold', width: 240 }}>
                      【Defect Code {group.code}: {group.name}】: {group.images.length}
                    </span>
                    {editCode === group.code ? (
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
                        onClick={() => this.setState({ editCode: group.code })}
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
                        key={img.id}
                        className={selected.includes(img.id) ? 'selected' : ''}
                        onClick={() => this.onImageSelect(img.id)}
                      >
                        <img src={`http://161.189.50.41${img.url}`} alt='' />
                      </li>
                    ))}
                    {!group.expand ? (
                      <StyleCodeDescription>
                        <div>
                          <h4>Characterization:</h4>
                          <Input.TextArea
                            disabled={editCode !== group.code}
                            defaultValue={group.characterization}
                            size='small'
                            onChange={e => this.onDefectInfoChange(index, 'characterization', e.target.value)}
                          />
                        </div>
                        <div>
                          <h4>Cause/Hypothesis:</h4>
                          <Input.TextArea
                            disabled={editCode !== group.code}
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

        <Modal
          title={modalMode}
          visible={visible}
          onOk={this.onModalOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form
            style={{ width: 400, margin: '0 auto' }}
            layout='vertical'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item label='Group:'>
              <AutoComplete
                allowClear
                size='small'
                filterOption={true}
                defaultValue={createLib.group}
                dataSource={['2', '222', '221', '2333']}
                style={{ width: 150 }}
                onChange={v => this.onCreateLibraryInput('group', v)}
              />
            </Form.Item>
            <Form.Item label='Product:'>
              <AutoComplete
                allowClear
                size='small'
                filterOption={true}
                defaultValue={createLib.group}
                dataSource={['2', '222', '221', '2333']}
                style={{ width: 150 }}
                onChange={v => this.onCreateLibraryInput('group', v)}
              />
            </Form.Item>
            <Form.Item label='Step Id:'>
              <AutoComplete
                allowClear
                size='small'
                filterOption={true}
                defaultValue={createLib.group}
                dataSource={['2', '222', '221', '2333']}
                style={{ width: 150 }}
                onChange={v => this.onCreateLibraryInput('group', v)}
              />
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
            <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(0)}>Home</Breadcrumb.Item>
            {galleryRouter.group !== '' ? (
              <>
                <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(1)}>{galleryRouter.group}</Breadcrumb.Item>
                {galleryRouter.product ? (
                  <>
                    <Breadcrumb.Item onClick={() => this.onGalleryRouterClick(2)}>
                      {galleryRouter.product}
                    </Breadcrumb.Item>
                    {galleryRouter.mb ? (
                      <Breadcrumb.Item>{galleryRouter.mb}</Breadcrumb.Item>
                    ) : null}
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
      </StyleLibrary>
    )
  }
}

injectReducer('Library', reducer)
const mapStateToProps = state => ({ ...state.Library })
const mapDispatchToProps = { changeToolboxLoading }
export default connect(mapStateToProps, mapDispatchToProps)(Library)
