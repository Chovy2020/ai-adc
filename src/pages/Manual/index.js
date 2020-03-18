import React from 'react'
import _ from 'lodash'
import LazyLoad from 'react-lazyload'
import { HotKeys } from 'react-hotkeys'
import { connect } from 'react-redux'
import hasPermission from '@/components/hasPermission'
import { DatePicker, Form, Button, Checkbox, Input, Select, Switch, AutoComplete, message } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import {
  LAYOUT_SIZE,
  FONT_SIZE,
  ITEMS_LIST,
  CATEGORY_TYPES,
  VIEW_GROUPS,
  getLotId,
  getWaferNo,
  getDefectId,
  getStepId
} from './constant'
import {
  StyleManual,
  StyleDataQuery,
  DragContainer,
  DragItem,
  DragCard,
  DragList,
  StyleContainer,
  StyleImagesGroup,
  StyleImages
} from './style'


const AuthButton = hasPermission(Button)

class Manual extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataQueryVisible: true,
      time: [],
      items: ['Product Id', 'Step Id', 'Lot Id', 'Wafer Id', 'Group Id'],
      itemsData: [],
      itemsKeyword: [],
      itemsSelected: [],
      // images
      data: {
        'MB : 0': {
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|69|M1_CMP|0': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-25.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-26.jpg?op=OPEN'
          ],
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|66|M1_CMP|0': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-23.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-24.jpg?op=OPEN'
          ],
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|207|M1_CMP|0': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-95.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-96.jpg?op=OPEN'
          ]
        },
        'MB : 1': {
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|7|M1_CMP|1': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-1.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-2.jpg?op=OPEN'
          ]
        },
        'MB : 2': {
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|84|M1_CMP|2': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-33.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-34.jpg?op=OPEN'
          ]
        },
        'MB : 3': {
          'F0004.000|1|Device01|M1_CMP|2020-01-05 23:43:35|180|M1_CMP|3': [
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-81.jpg?op=OPEN',
            '/webhdfs/v1/ai_yei/archive/image/F0004-000-000-0001-tif-82.jpg?op=OPEN'
          ]
        }
      },
      columns: 6,
      showLabel: true,
      labelSize: 12,
      categoryType: 'MB',
      classCodes: ['0-No_Review', '1-FALSE', '2-Unknown', '278-MG_Replaced', '279-MG_Missing'], // ！通过接口获取
      classCode: '0-No_Review',
      viewFilters: ['0', '1', '2', '3', '4', '5', '6', '9', '278', '279'], // ！通过接口获取
      viewFilter: [],
      viewGroup: 'MB',
      // selected
      images: [],
      selected: [],
      hotkeyEnable: true,
      hotkeys: [
        {
          key: 'A',
          code: '1-FALSE'
        },
        {
          key: 'B',
          code: '2-Unknown'
        },
        {
          key: 'C',
          code: '278-MG_Replaced'
        }
      ],
      keyMap: {},
      keyHandlers: {}
    }
  }
  
  // 初始化
  componentDidMount() {
    this.props.changeMenu('manual')
    const { items } = this.state
    let itemsData = items.map(() => [])
    let itemsKeyword = items.map(() => '')
    let itemsSelected = items.map(() => [])
    itemsData = [
      ['Device01', 'Device02', 'Device03', 'Device04'],
      ['M1_CMP', 'M2_CMP', 'M3_CMP'],
      ['F0002.000', 'F0001.000'],
      ['1', '2'],
      ['g001', 'g002']
    ]
    itemsSelected = [['Device02'], ['M1_CMP'], ['F0002.000', 'F0001.000'], ['1', '2'], ['g002']]
    itemsKeyword[1] = 'm1'
    this.setState({ itemsData, itemsKeyword, itemsSelected })
    this.generateKeyMapAndHandlers()
  }
  // 修改时间
  onDatePickerChange = (dates, time) => {
    this.setState({ time })
  }
  // - - - - - - - - - - - - - - - - - - Drag - - - - - - - - - - - - - - - - - -
  onItemsSearch = index => {}
  // 点击选择高亮
  onItemsSelect = (i, text) => {
    const { items, itemsSelected } = this.state
    if (itemsSelected[i].includes(text)) itemsSelected[i] = itemsSelected[i].filter(s => s !== text)
    else itemsSelected[i].push(text)
    this.setState({ itemsSelected })
    // 更新下一列的数据
    if (i < items.length - 1) this.onItemsSearch(i + 1)
  }
  onItemsInput = (i, v) => {
    const { itemsKeyword } = this.state
    itemsKeyword[i] = v
    this.setState({ itemsKeyword })
  }
  onQueryChange = newItems => {
    // 新增项 放置最后
    let { items } = this.state
    if (newItems.length > items.length) {
      const newItem = _.difference(newItems, items)[0]
      items.push(newItem)
    } else {
      const newItem = _.difference(items, newItems)[0]
      items = items.filter(item => item !== newItem)
    }
    this.setState({ items })
  }
  onItemsLoad = async () => {
    await this.loadImages()
    this.setState({ dataQueryVisible: false })
  }
  onItemsReset = () => {}
  // - - - - - - - - - - - - - - - - - - Classified - - - - - - - - - - - - - - - - - -
  onClassifiedOk = params => {
    if (typeof params === 'string') {
      console.log('Hotkey classification', params)
    } else {
      console.log('Manual classification')
    }
    const { selected } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    this.setState({ selected: [] })
    message.success('Classification operation succeeded')
  }
  onClassifiedReset = () => {
    this.setState({ selected: [] })
  }
  onAddToLibrary = () => {
    const { selected } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    this.setState({ selected: [] })
    message.success('Add to library succeeded')
  }
  // - - - - - - - - - - - - - - - - - - Images - - - - - - - - - - - - - - - - - -
  // 获取图片链接的列表 + 过滤
  loadImages = async () => {
    this.props.changeToolboxLoading(true)
    this.setState({ images: [] })
    await delay(300)
    this.props.changeToolboxLoading(false)
    const { data } = this.state
    const images = {}
    let count = 0
    for (const group in data) {
      images[group] = []
      for (const id in data[group]) {
        for (const index in data[group][id]) {
          count++
          images[group].push({
            id,
            index,
            url: data[group][id][index]
          })
        }
      }
    }
    this.setState({ images })
    if (count === 0) message.warning('No photos yet')
  }
  /**
   * 图片选择、反选、连选
   * @param {String} nextId
   * @param {Number} index
   * @param {String} group
   */
  onSelect = nextId => {
    let { selected } = this.state
    // 普通单选模式
    if (selected.includes(nextId)) {
      selected = selected.filter(n => n !== nextId)
    } else {
      selected.push(nextId)
    }
    this.setState({ selected })
  }
  // - - - - - - - - - - - - - - - - - - Drawer - - - - - - - - - - - - - - - - - -
  // 侧边栏 筛选
  onFilterSubmit = () => {
    this.loadImages()
  }

  generateKeyMapAndHandlers = () => {
    const { hotkeys } = this.state
    const keyMap = {}
    const keyHandlers = {}
    for (const h of hotkeys) {
      const key = h.key.toLocaleLowerCase()
      keyMap[key] = key
      keyHandlers[key] = () => this.onClassifiedOk(h.code)
    }
    this.setState({ keyMap, keyHandlers })
  }

  render() {
    const { dataQueryVisible, items, itemsData, itemsSelected, itemsKeyword } = this.state
    const { columns, showLabel, labelSize, categoryType, classCodes, classCode, images, selected } = this.state
    const { viewGroup, viewFilters, hotkeys, keyMap, keyHandlers, hotkeyEnable } = this.state

    return (
      <StyleManual>
        <StyleDataQuery className={dataQueryVisible ? '' : 'collapse'}>
          {dataQueryVisible ? (
            <Form layout='vertical' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <Form.Item label='Time:'>
                <DatePicker.RangePicker size='small' onChange={this.onDatePickerChange} />
              </Form.Item>
              <Form.Item label='Query:'>
                <Checkbox.Group options={ITEMS_LIST} defaultValue={items} onChange={this.onQueryChange} />
              </Form.Item>
              {items.length > 0 ? (
                <Form.Item label=' '>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId='droppable' direction='horizontal'>
                      {p1 => (
                        <DragContainer ref={p1.innerRef} {...p1.droppableProps}>
                          {items.map((item, index) => (
                            <Draggable key={item} draggableId={item} index={index}>
                              {p2 => (
                                <DragItem ref={p2.innerRef} {...p2.draggableProps} {...p2.dragHandleProps}>
                                  <DragCard>
                                    <h4>
                                      {item} 【{itemsSelected[index] ? itemsSelected[index].length : 0 || 0}/
                                      {itemsData[index] ? itemsData[index].length : 0}】
                                    </h4>
                                    <Input.Search
                                      value={itemsKeyword[index]}
                                      onChange={e => this.onItemsInput(index, e.target.value)}
                                      // onSearch={() => this.onSearchMark(index)}
                                      size='small'
                                      enterButton
                                    />
                                    <DragList
                                      dataSource={itemsData[index]}
                                      renderItem={text => (
                                        <p
                                          className={itemsSelected[index].includes(text) ? 'active' : ''}
                                          onClick={() => this.onItemsSelect(index, text)}
                                        >
                                          {text}
                                        </p>
                                      )}
                                    />
                                  </DragCard>
                                </DragItem>
                              )}
                            </Draggable>
                          ))}
                          {p1.placeholder}
                        </DragContainer>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Form.Item>
              ) : null}
              <Form.Item label=' '>
                <AuthButton auth='classification' onClick={this.onItemsLoad} type='primary'>
                  Load
                </AuthButton>
                <Button onClick={this.onItemsReset} type='dashed'>
                  Reset
                </Button>
                <Button onClick={() => this.setState({ dataQueryVisible: false })} type='dashed'>
                  Collapse
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Button
              size='small'
              style={{ width: '100%' }}
              onClick={() => this.setState({ dataQueryVisible: true })}
              type='dashed'
            >
              Data Query
            </Button>
          )}
        </StyleDataQuery>
        <StyleContainer className={dataQueryVisible ? '' : 'collapse'}>
          <div className='image'>
            <Form layout='vertical' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <Form.Item label='Layout:'>
                <span>Columns:</span>
                <Select
                  size='small'
                  defaultValue={columns}
                  style={{ width: 55, marginLeft: 5 }}
                  onChange={columns => this.setState({ columns })}
                >
                  {LAYOUT_SIZE.map(s => (
                    <Select.Option value={s} key={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
                <Checkbox
                  size='small'
                  style={{ marginLeft: 20 }}
                  onChange={e => this.setState({ showLabel: e.target.checked })}
                  defaultChecked={showLabel}
                >
                  Show Label
                </Checkbox>
                {showLabel ? (
                  <>
                    <span style={{ marginLeft: 20 }}>Label Size:</span>
                    <Select
                      size='small'
                      style={{ width: 55, marginLeft: 5 }}
                      value={labelSize}
                      onChange={labelSize => this.setState({ labelSize })}
                    >
                      {FONT_SIZE.map(t => (
                        <Select.Option value={t} key={t}>
                          {t}
                        </Select.Option>
                      ))}
                    </Select>
                  </>
                ) : null}
              </Form.Item>
              <Form.Item label='Classified:'>
                <Select
                  size='small'
                  style={{ width: 120 }}
                  defaultValue={categoryType}
                  onChange={categoryType => this.setState({ categoryType })}
                >
                  {CATEGORY_TYPES.map(t => (
                    <Select.Option value={t[1]} key={t[1]}>
                      {t[0]}
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
                <Button size='small' onClick={this.onClassifiedOk} type='primary' style={{ marginLeft: 10 }}>
                  Ok
                </Button>
                <Button size='small' onClick={this.onClassifiedReset} type='dashed'>
                  Reset
                </Button>
                <span style={{ margin: '0 5px 0 10px' }}>Hotkey:</span>
                <Switch defaultChecked={hotkeyEnable} />
                <Button size='small' onClick={this.onAddToLibrary} type='primary'>
                  Add to Library
                </Button>
              </Form.Item>
            </Form>
            <StyleImagesGroup>
              <HotKeys keyMap={keyMap} handlers={keyHandlers}>
                {Object.keys(images).map(key => (
                  <div key={key}>
                    {images[key].length > 0 ? <h3>【{key}】</h3> : null}
                    <StyleImages className={`col${columns}`}>
                      {images[key].map((img, index) => (
                        <li
                          key={`${img.id}-${index}`}
                          className={selected.includes(img.id) ? 'selected' : ''}
                          onClick={() => this.onSelect(img.id, img.index, key)}
                        >
                          <LazyLoad height={200} offset={300} overflow={true}>
                            <img src={`http://161.189.50.41${img.url}`} alt='' />
                          </LazyLoad>
                          {showLabel ? (
                            <div className={`wafer-info font-size-${labelSize}`}>
                              <p>Lot ID: {getLotId(img.id)}</p>
                              <p>Wafer No: {getWaferNo(img.id)}</p>
                              <p>Defect ID: {getDefectId(img.id)}</p>
                              <p>Step: {getStepId(img.id)}</p>
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </StyleImages>
                  </div>
                ))}
              </HotKeys>
            </StyleImagesGroup>
          </div>
          <div className='drawer common-drawer'>
            <section className='util'>
              <h4 style={{ width: 80 }}>Utilization</h4>
              <Form layout='vertical' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Form.Item label='Group:'>
                  <Select
                    size='small'
                    style={{ width: 120 }}
                    defaultValue={viewGroup}
                    onChange={viewGroup => this.setState({ viewGroup })}
                  >
                    {VIEW_GROUPS.map(g => (
                      <Select.Option value={g[1]} key={g[1]}>
                        {g[0]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label='Filters:'>
                  <Checkbox.Group
                    size='small'
                    options={viewFilters}
                    onChange={viewFilter => this.setState({ viewFilter })}
                  />
                </Form.Item>
                <Form.Item label=' '>
                  <Button size='small' onClick={this.onFilterSubmit} style={{ float: 'right' }} type='primary'>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </section>
            <section className='info'>
              <h4 style={{ width: 80 }}>Infomation</h4>
              <h5>Hotkey Setting</h5>
              <ul>
                {hotkeys.map(h => (
                  <li key={h.key}>
                    【{h.key}】： {h.code}
                  </li>
                ))}
              </ul>
              <h5>ADC Module Infomation</h5>
              <table>
                <tbody>
                  <tr>
                    <td>Name：</td>
                    <td>Allinabc_f5b3_001</td>
                  </tr>
                  <tr>
                    <td>Time：</td>
                    <td>2020-03-02</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </StyleContainer>
      </StyleManual>
    )
  }
}

injectReducer('Manual', reducer)
const mapStateToProps = state => ({ ...state.Manual })
const mapDispatchToProps = { changeToolboxLoading, changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(Manual)
