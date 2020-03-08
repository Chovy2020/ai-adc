import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { Row, Col, Icon, Tooltip, Button, Input, Select, Popover, Modal, Breadcrumb, message } from 'antd'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import { getClassifyCodes } from '@/pages/Manual/service'
import reducer from './reducer'
import { PRE_TREATMENT, MODEL_TUNING, REJECT_MODEL, LIBRARY } from './constant'
import { StyleBuilder, StyleToolsGroup, StyleImagesContainer, StyleImages, StyleImagesModal } from './style'

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
      // images
      router: {
        library: '',
        mb: ''
      },
      files: [],
      isFolder: true,
      selected: [],
      // image library
      visible: false,
      library: [],
      librarySelected: [],
      classifyCodes: [],
      classifyCode: ''
      // models
    }
  }
  // 初始化
  componentDidMount() {
    this.loadFiles(true)
    this.setState({ library: LIBRARY })
    // this.setState({ classifyCodes: await getClassifyCodes() })
  }
  loadFiles = (isFolder = true) => {
    this.setState({ files: [] })
    const { router } = this.state
    const isLibrary = router.library === ''
    let files = []
    if (isFolder) {
      for (let i = 0; i < 5; i++) {
        files.push({
          id: i,
          name: isLibrary
            ? 'Library-' +
              Math.random()
                .toString(36)
                .substr(2, 6)
            : 'MB-' + Math.floor(Math.random() * 279)
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
        },
      ]
    }
    this.setState({ files, isFolder })
  }
  // Load Model
  onModelChange = async model => {
    this.setState({
      model,
      router: {
        library: '',
        mb: ''
      }
    })
    // call api
    this.props.changeToolboxLoading(true)
    await delay(500)
    this.props.changeToolboxLoading(false)
    this.loadFiles(true)
  }
  // - - - - - - - - - - - - - - - - - - Images - - - - - - - - - - - - - - - - - -
  onRouterClick = i => {
    const { router } = this.state
    if (i === 0) {
      router.library = ''
      router.mb = ''
    } else if (i === 1) {
      router.mb = ''
    }
    this.loadFiles()
    // 清空已选择的图片，不允许跨文件夹多选
    this.setState({ router, selected: [] })
  }
  // 双击打开文件夹
  onFolderDbClick = folder => {
    const { router, isFolder } = this.state
    if (!isFolder) return
    if (router.library === '') {
      // 打开Library
      router.library = folder.name
      this.setState({ router })
      this.loadFiles(true)
    } else {
      // 打开Manual Bin, 展示图片
      router.mb = folder.name
      this.setState({ router })
      this.loadFiles(false)
    }
  }
  // 选择图片
  onImageSelect = id => {
    const { isFolder } = this.state
    if (isFolder) return
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

  render() {
    const { models, model, router, files, isFolder, selected } = this.state
    const { visible, classifyCodes, classifyCode, library, librarySelected } = this.state
    const ModelAndTemplate = (
      <Select style={{ width: 120 }} defaultValue={model} onChange={this.onModelChange}>
        {models.map(m => (
          <Select.Option key={m.id} value={m.id}>
            {m.name}
          </Select.Option>
        ))}
      </Select>
    )

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
                      <Icon theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <h4>Model Tuning</h4>
              <ul>
                {MODEL_TUNING.map(m => (
                  <li key={m.name}>
                    <Tooltip placement='topLeft' title={m.name}>
                      <Icon theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <h4>Reject Model</h4>
              <ul>
                {REJECT_MODEL.map(m => (
                  <li key={m.name}>
                    <Tooltip placement='topLeft' title={m.name}>
                      <Icon theme='filled' type={m.icon} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </StyleToolsGroup>
          </Col>
          <Col span={21} style={{ padding: 10 }}>
            <Popover content={ModelAndTemplate}>
              <Button type='primary'>Load Model</Button>
            </Popover>
            <Popover content={ModelAndTemplate}>
              <Button type='primary'>Load Template \& Create</Button>
            </Popover>
            <StyleImagesContainer>
              <Button size='small' onClick={() => this.setState({ visible: true })}>
                Add Image
              </Button>
              <Button size='small' type='danger' onClick={this.onRemoveImages}>
                Remove Image
              </Button>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item onClick={() => this.onRouterClick(0)}>Home</Breadcrumb.Item>
                {router.library !== '' ? (
                  <>
                    <Breadcrumb.Item onClick={() => this.onRouterClick(1)}>{router.library}</Breadcrumb.Item>
                    {router.mb ? <Breadcrumb.Item>{router.mb}</Breadcrumb.Item> : null}
                  </>
                ) : null}
              </Breadcrumb>
              <StyleImages className={isFolder ? 'gallery' : 'images'} style={{ overflowY: 'auto', maxHeight: 240 }}>
                {isFolder ? (
                  <>
                    {files.map(folder => (
                      <li key={folder.id} onDoubleClick={() => this.onFolderDbClick(folder)}>
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
          </Col>
        </Row>

        <StyleImagesModal
          title='Images Gallery'
          visible={visible}
          width={1000}
          onOk={this.onModalOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <span>Defect Code：</span>
          <Select defaultValue={classifyCode} style={{ width: 150 }}>
            {classifyCodes.map(c => (
              <Select.Option key={c.classCode} value={c.classCode}>
                {c.classCode}-{c.className}
              </Select.Option>
            ))}
          </Select>
          <StyleImages className='images'>
            {library.map(img => (
              <li
                key={img.id}
                className={librarySelected.includes(img.id) ? 'selected' : ''}
                onClick={() => this.onLibraryImageSelect(img.id)}
              >
                <img src={`http://161.189.50.41${img.url}`} alt='' />
              </li>
            ))}
          </StyleImages>
        </StyleImagesModal>
      </StyleBuilder>
    )
  }
}

injectReducer('Builder', reducer)
const mapStateToProps = state => ({ ...state.Builder })
const mapDispatchToProps = { changeToolboxLoading }
export default connect(mapStateToProps, mapDispatchToProps)(Builder)
