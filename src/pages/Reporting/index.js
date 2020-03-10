import React from 'react'
// import _ from 'lodash'
// import LazyLoad from 'react-lazyload'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
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
// import { changeToolboxLoading } from '@/utils/action'
// import { delay } from '@/utils/web'
import { injectReducer } from '@/utils/store'
// import { getClassifyCodes } from '@/pages/Manual/service'
// import reducer from './reducer'
// import { PRE_TREATMENT, MODEL_TUNING, REJECT_MODEL, LIBRARY } from './constant'
import { StyleReporting, StyleOverview } from './style'

class Reporting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overviewChart1: null,
      overviewChart2: null
    }
  }

  componentDidMount() {
    const overviewChart1 = echarts.init(document.getElementById('overview-chart-1'))
    const overviewChart2 = echarts.init(document.getElementById('overview-chart-2'))
    this.setState({ overviewChart1, overviewChart2 })
  }

  render() {
    const { overviewChart1, overviewChart2 } = this.state
    if (overviewChart1)
      overviewChart1.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          position: 'center',
          data: ['Active', 'Pi-run', 'Disable']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 50, name: 'Active' },
              { value: 30, name: 'Pi-run' },
              { value: 40, name: 'Disable' }
            ]
          }
        ]
      })

    if (overviewChart2)
      overviewChart2.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          position: 'center',
          data: ['Product A', 'Product B', 'Product C', 'Product D']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 150, name: 'Product A' },
              { value: 130, name: 'Product B' },
              { value: 240, name: 'Product C' },
              { value: 140, name: 'Product D' }
            ]
          }
        ]
      })

    return (
      <StyleReporting>
        <h2>Reporting</h2>
        <StyleOverview>
          <Row>
            <Col span={12} id='overview-chart-1' style={{ height: 300 }}></Col>
            <Col span={12} id='overview-chart-2' style={{ height: 300 }}></Col>
          </Row>
        </StyleOverview>
      </StyleReporting>
    )
  }
}

export default Reporting
