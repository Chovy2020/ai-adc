import React from 'react'
import _ from 'lodash'
import LazyLoad from 'react-lazyload'
import { HotKeys } from 'react-hotkeys'
import { connect } from 'react-redux'
import hasPermission from '@/components/hasPermission'
import { DatePicker, Form, Button, Checkbox, Input, Select, Switch, AutoComplete, message } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import { reorder } from '@/utils/web'
import { injectReducer } from '@/utils/store'
import reducer from './reducer'
import { getClassCodes } from '@/pages/Config/service'
import { getItemsData, getImages, updateClassification ,getHotkeys} from './service'
import {
  LAYOUT_SIZE,
  FONT_SIZE,
  ITEMS_LIST,
  ITEMS_MAPPING,
  ITEMS_MAPPING_2,
  CATEGORY_TYPES,
  VIEW_GROUPS
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

class Classification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataQueryVisible: true,
      time: [],
      items: ['Product Id', 'Step Id', 'Lot Id', 'Wafer Id', 'Group Id'], // 默认拖拽框
      itemsData: [],
      itemsKeyword: [],
      itemsSelected: [],
      // images 123
      data: [],
      columns: 6,
      showLabel: true,
      labelSize: 12,
      categoryType: 'MB',
      classCodes: [], // ！通过接口获取
      classCode: null,
      viewFilters: [], // ！通过图片接口数据，前端封装
      viewFilter: [],
      viewGroup: 'MAN_BIN',
      // selected
      images: [],
      selected: [],
      hotkeyEnable: false,
      hotkeys: [],
      // { A: '1-FALSE', B: '2-Unknown' }
      keyMap: {},
      keyHandlers: {}
    }
  }

  // 初始化
  async componentDidMount() {
    //classification 提交
    this.props.changeMenu('classification')
    this.setState({
      classCodes: await getClassCodes()
    })
    this.onItemsReset()
  }
  // 修改时间
  onDatePickerChange = (dates, time) => {
    this.setState({ time })
  }
  search = async index => {
    const { items, itemsSelected, itemsKeyword ,time} = this.state
    const params = {
      pageNo: 1,
      pageSize: 1000
    }
    const data = {
      keywords: itemsKeyword[index],
      targetField: ITEMS_MAPPING[items[index]],
      scanTimeBegin:time[0] || '1970-01-01',
      scanTimeEnd:time[1] || '2020-12-31'
    }
    if (index > 0) {
      for (let i = 0; i < index; i++) {
        if (itemsSelected[i].length === 0) return []
        data[ITEMS_MAPPING_2[items[i]]] = itemsSelected[i]
      }
    }
    params.data = data
    return await getItemsData(params)
  }
  // - - - - - - - - - - - - - - - - - - Drag - - - - - - - - - - - - - - - - - -
  // 获取列数据
  onSearch = async index => {
    const res = await this.search(index)
    const { items, itemsData, itemsSelected, itemsKeyword } = this.state
    itemsData[index] = res
    // 清空后续列表, 和当前列mark
    for (const i in items) {
      if (i > index) {
        itemsData[i] = []
        itemsKeyword[i] = ''
      }
      if (i >= index) itemsSelected[i] = []
    }
    this.setState({ itemsData, itemsKeyword, itemsSelected })
  }
  // 标记
  onMark = async index => {
    const res = await this.search(index)
    // 如果跳跃列选择，待选择列表为空，补充搜索结果进待选择列表
    const { items, itemsData, itemsSelected } = this.state
    if (itemsData[index].length === 0 && res.length > 0) {
      console.log('初始数据为空，Mark却有数据！')
      itemsData[index] = res
      this.setState({ itemsData })
    }
    itemsSelected[index] = res
    this.setState({ itemsSelected })
    // 加载下一列
    if (index < items.length - 1) this.onSearch(index + 1)
  }
  // 拖拽事件完成回调
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) return
    const source = result.source.index
    const destination = result.destination.index
    const min = Math.min(source, destination)
    const { items, itemsKeyword } = this.state
    this.setState(
      {
        items: reorder(items, source, destination),
        itemsKeyword: reorder(itemsKeyword, source, destination)
      },
      () => {
        if (min === 0) this.onItemsReset()
        else this.onSearch(min)
      }
    )
  }
  // 点击选择高亮
  onItemsSelect = (i, text) => {
    const { items, itemsSelected } = this.state
    if (itemsSelected[i].includes(text)) itemsSelected[i] = itemsSelected[i].filter(s => s !== text)
    else itemsSelected[i].push(text)
    this.setState({ itemsSelected })
    // 更新下一列的数据
    if (i < items.length - 1) this.onSearch(i + 1)
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
    // 加载完图片，再加载热键
    const { items, itemsSelected } = this.state
    let hotkeyEnable = false
    let groupName = null
    if (items.includes('Group Id')) {
      for (const i in items) {
        if (items[i] === 'Group Id' && itemsSelected[i].length === 1) {
          hotkeyEnable = true
          groupName = itemsSelected[i][0] 
        }
      }
    }
    this.setState({ hotkeyEnable })
    if (hotkeyEnable) {
      const hotkeys = await getHotkeys(groupName)
      this.setState({ hotkeys })
      this.generateKeyMapAndHandlers()
    }
  }
  // Items初始化
  onItemsReset = () => {
    const { items } = this.state
    this.setState({
      itemData: items.map(() => []),
      itemSelected: items.map(() => []),
      itemKeyword: items.map(() => '')
    })
    this.onSearch(0)
  }
  // - - - - - - - - - - - - - - - - - - Classified - - - - - - - - - - - - - - - - - -
  onClassifiedOk = async params => {
    let code = null
    if (typeof params === 'string') {
      if (params !== '') {
        const codes = params.split('-')
        code = codes[0]
        const { hotkeyEnable } = this.state
        if (!hotkeyEnable) return
      }
    }
    const { selected, classCode, categoryType } = this.state
    if (selected.length === 0) {
      message.warning('Please select images first')
      return
    }
    if (code === null) {
      const codes = classCode.split('-')
      code = codes[0]
    }
    const updateData = {
      manualCode: code,
      classifyCode: categoryType,
      defectIds: selected
    }
    message.success('Classification operation succeeded')
    await updateClassification(updateData)
    await this.loadImages()
    this.setState({ selected: [] })
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
    //api 传 选择图片Ids
    this.setState({ selected: [] })
    message.success('Add to library succeeded')
  }
  onHotkeyEnableChange = hotkeyEnable => {
    this.setState({ hotkeyEnable, selected: [] })
  }
  // - - - - - - - - - - - - - - - - - - Images - - - - - - - - - - - - - - - - - -
  // 获取图片链接的列表 + 过滤
  loadImages = async () => {
    this.setState({ images: [], viewFilters: [] })
    const { items, itemsSelected, time, viewGroup } = this.state
    //get images
    const imageData = {
      scanTimeBegin: time[0] || '1970-01-01',
      scanTimeEnd: time[1] || '2020-12-31',
      groupField: viewGroup
    }
    if (time.length > 0) {
      imageData.scanTimeBegin = time[0]
      imageData.scanTimeEnd = time[1]
    }
    for (const index in items) {
      for (const item in ITEMS_MAPPING_2) {
        if (ITEMS_MAPPING_2[item][0] === items[index]) {
          imageData[ITEMS_MAPPING_2[item][1]] = itemsSelected[index]
        }
      }
    }
    const res = await getImages(imageData)
    const images = {}
    const viewFilters = []
    let count = 0
    for (const group in res) {
      images[group] = []
      for (const id in res[group]) {
        count++
        if (viewFilters === []) viewFilters.push(res[group][id].manBin)
        if (!viewFilters.includes(res[group][id].manBin)) {
          viewFilters.push(res[group][id].manBin)
        }
        images[group].push({
          id: res[group][id].waferDefectId + '-' + count,
          waferDefectId: res[group][id].waferDefectId,
          waferNo: res[group][id].waferNo,
          defectId: res[group][id].defectId,
          step: res[group][id].step,
          manBin: res[group][id].manBin,
          url: res[group][id].tiffFilePath
        })
      }
    }

    this.setState({ images, viewFilters })
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
  // 生成热键、热键绑定事件
  generateKeyMapAndHandlers = () => {
    const { hotkeys, classCodes } = this.state
    const keyMap = {}
    const keyHandlers = {}
    for (const h of hotkeys) {
      const key = h.hotkey.toLocaleLowerCase()
      let code = null
      for (const index in classCodes) {
        if (classCodes[index].id === h.manualCodeId) {
          code = classCodes[index].manualCode + '-' + classCodes[index].manualName
        }
      }
      h.remark = code
      keyMap[key] = key
      keyHandlers[key] = () => this.onClassifiedOk(code)
    }
    this.setState({ keyMap, keyHandlers })
  }

  render() {
    const { dataQueryVisible, items, itemsData, itemsSelected, itemsKeyword } = this.state
    const { columns, showLabel, labelSize, categoryType, classCodes, classCode, images, selected } = this.state
    const { viewGroup, viewFilters, viewFilter, hotkeys, keyMap, keyHandlers, hotkeyEnable } = this.state

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
                                      onSearch={() => this.onMark(index)}
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
                <Button onClick={this.onItemsLoad} type='primary'>
                  Load
                </Button>
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
                  style={{ width: 200 }}
                  onSelect={classCode => this.setState({ classCode })}
                >
                  {classCodes.map(code => (
                    <AutoComplete.Option key={code.id} value={code.manualCode + '-' + code.manualName}>
                      {`${code.manualCode} - ${code.manualName}`}
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>
                <Button size='small' onClick={this.onClassifiedOk} type='primary' style={{ marginLeft: 10 }}>
                  Ok
                </Button>
                <Button size='small' onClick={this.onClassifiedReset} type='dashed'>
                  Reset
                </Button>
                <span style={{ margin: '0 5px 0 10px' }}>Hotkey:</span>
                <Switch checked={hotkeyEnable} onChange={this.onHotkeyEnableChange} />
                <AuthButton
                  auth='adc:classification:add_to_library'
                  size='small'
                  onClick={this.onAddToLibrary}
                  type='primary'
                >
                  Add to Library
                </AuthButton>
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
                          key={`${img.id}`}
                          className={selected.includes(img.waferDefectId) ? 'selected' : ''}
                          onClick={() => this.onSelect(img.waferDefectId, key)}
                          style={{
                            display:
                              viewFilter.length <= 0
                                ? 'block'
                                : viewFilter.indexOf(img.manBin) !== -1
                                ? 'block'
                                : 'none'
                          }}
                        >
                          <LazyLoad height={200} offset={300} overflow={true}>
                            <img src={`${window.BASE_URL}${img.url}`} alt='' />
                          </LazyLoad>
                          {showLabel ? (
                            <div className={`wafer-info font-size-${labelSize}`}>
                              <p>Lot ID: {img.lotId}</p>
                              <p>Wafer No: {img.waferNo}</p>
                              <p>Defect ID: {img.defectId}</p>
                              <p>Step: {img.step}</p>
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
                    onChange={viewGroup => this.setState({ viewGroup: _.cloneDeep(viewGroup) })}
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
              {hotkeyEnable ? (
                <>
                  <h5>Hotkey Setting</h5>
                  <ul>
                    {hotkeys.map(h => (
                      <li key={h.hotkey}>
                        【{h.hotkey}】： {h.remark}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
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

injectReducer('Classification', reducer)
const mapStateToProps = state => ({ ...state.Classification })
const mapDispatchToProps = { changeToolboxLoading, changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(Classification)
