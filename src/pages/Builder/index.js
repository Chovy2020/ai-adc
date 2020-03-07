import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { Row, Col, Icon, Tooltip, Form, Button, Input, Select, AutoComplete, Modal, Breadcrumb, message } from 'antd'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading } from '@/utils/action'
import Folder from '@/assets/images/folder.png'
// import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import { PRE_TREATMENT, MODEL_TUNING, REJECT_MODEL } from './constant'
import { StyleBuilder, StyleToolsGroup, StyleModelImages, StyleImages } from './style'

class Builder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // images
      router: {
        library: '',
        mb: ''
      },
      files: [],
      isFolder: true,
      selected: []
      // models
    }
  }
  // 初始化
  componentDidMount() {
    this.loadFiles(true)
  }
  loadFiles = (isFolder = true) => {
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
        }
      ]
    }
    this.setState({ files, isFolder })
  }
  // - - - - - - - - - - - - - - - - - - Image - - - - - - - - - - - - - - - - - -
  onRouterClick = i => {
    const { router } = this.state
    if (i === 0) {
      router.library = ''
      router.mb = ''
    } else if (i === 1) {
      router.mb = ''
    }
    this.loadFiles()
    this.setState({ router })
  }
  // 双击打开文件夹
  onFolderDbClick = folder => {
    const { router } = this.state
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
  onImageSelect = imageId => {}

  // - - - - - - - - - - - - - - - - - - Model - - - - - - - - - - - - - - - - - -

  render() {
    const { router, files, isFolder, selected } = this.state

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
            <Button type='primary'>Load Model</Button>
            <Button type='primary'>Load Template \& Create</Button>
            <StyleModelImages>
              <Button size='small'>Add Image</Button>
              <Button size='small'>Remove Image</Button>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item onClick={() => this.onRouterClick(0)}>Home</Breadcrumb.Item>
                {router.library !== '' ? (
                  <>
                    <Breadcrumb.Item onClick={() => this.onRouterClick(1)}>{router.library}</Breadcrumb.Item>
                    {router.mb ? <Breadcrumb.Item>{router.mb}</Breadcrumb.Item> : null}
                  </>
                ) : null}
              </Breadcrumb>
              <StyleImages className='gallery'>
                {files.map(file => (
                  <li
                    key={file.id}
                    className={selected.includes(file.id) ? 'selected' : ''}
                    onDoubleClick={() => this.onFolderDbClick(file)}
                    onClick={() => this.onImageSelect(file.id)}
                  >
                    <img src={isFolder ? Folder : `http://161.189.50.41${file.url}`} alt='' />
                    <p>{file.name}</p>
                  </li>
                ))}
              </StyleImages>
            </StyleModelImages>
          </Col>
        </Row>
      </StyleBuilder>
    )
  }
}

injectReducer('Builder', reducer)
const mapStateToProps = state => ({ ...state.Builder })
const mapDispatchToProps = { changeToolboxLoading }
export default connect(mapStateToProps, mapDispatchToProps)(Builder)
