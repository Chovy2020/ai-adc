import React from 'react'
import echarts from 'echarts'
import { connect } from 'react-redux'
import { Row, Col, Button, Input, Radio, Select } from 'antd'
import { changeToolboxLoading, changeMenu } from '@/utils/action'
import { delay } from '@/utils/web'
import { LIBRARY } from '@/pages/Builder/constant'
import { TABLE_DATA, PIE_COLORS } from './constant'
import {
  StyleReporting,
  StyleOverview,
  StyleModelsMonitor,
  StyleMonitor,
  StyleTable,
  StyleImagesModal,
  StyleImages
} from './style'
import { countModelStatus, countProduct } from './service'

class Reporting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overviewChart1: null,
      overviewChart2: null,
      // data range
      viewBy: 'DAY',
      lots: '',
      days: '',
      models: [
        {
          id: 1,
          name: 'Step A ADC Model'
        },
        {
          id: 2,
          name: 'Step B ADC Model'
        }
      ],
      model: null,
      monitors: [
        {
          id: 1
        }
      ],
      visible: false,
      images: []
    }
  }

  async componentDidMount() {
    let modelId = this.props.location.state ? this.props.location.state.modelId : null
    if (modelId) {
      console.log('modelId', modelId)
    }
    this.props.changeMenu('reporting')
    this.props.changeToolboxLoading(true)
    const overviewChart1 = echarts.init(document.getElementById('overview-chart-1'))
    const overviewChart2 = echarts.init(document.getElementById('overview-chart-2'))
    overviewChart1.setOption(this.modelStatusConfig(await countModelStatus()))
    overviewChart2.setOption(this.modelStatusConfig(await countProduct()))
    this.setState({ overviewChart1, overviewChart2 }, () => {
      this.props.changeToolboxLoading(false)
    })
    this.renderMonitors()
  }

  // Overview Config
  modelStatusConfig = data => {
    data = data.map(item => {
      return {
        name: item.name || 'Other',
        value: item.value
      }
    })
    return {
      color: PIE_COLORS,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        icon: 'circle',
        position: 'center'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
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
          data
        }
      ]
    }
  }

  onModelSelect = model => {
    this.setState({ model })
  }

  onAddMonitoer = () => {
    const { monitors, model } = this.state
    monitors.push({
      id: Math.floor(Math.random() * 1000000),
      model
    })
    this.setState({ monitors })
    this.renderMonitors()
  }

  onRemoveMonitoer = () => {
    let { monitors, model } = this.state
    monitors = monitors.filter(m => m.model !== model)
    this.setState({ monitors })
    this.renderMonitors()
  }

  renderMonitors = async () => {
    await delay(1)
    const { monitors } = this.state
    monitors.forEach(m => this.generateMonitorCharts(m))
  }

  onViewImages = (source, record, column) => {
    if (source === 'matrix') {
      console.log('matrix', record[column])
    }
    this.setState({ visible: true, images: LIBRARY })
  }

  generateMonitorCharts = async monitor => {
    await delay(1)
    const accuracyWeekChart = echarts.init(document.getElementById(`accuracy-week-${monitor.id}`))
    accuracyWeekChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['WWK1', 'WWK2', 'WWK3', 'WWK4', 'WWK5'],
        axisLine: {
          lineStyle: {
            color: 'rgba(245, 247, 248, 1)'
          }
        },
        axisLabel: {
          textStyle: { color: '#666' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(245, 247, 248, 1)'
          }
        }
      },
      series: [
        {
          data: [12, 20, 15, 8, 7],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: 'rgba(39, 164, 73, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(39, 164, 73, .6)'
                  }
                ],
                false
              )
            }
          }
        }
      ]
    })
    accuracyWeekChart.on('click', params => this.onBarChartClick('WEEK', monitor, params))
    const accuracyLotChart = echarts.init(document.getElementById(`accuracy-lot-${monitor.id}`))
    accuracyLotChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Lot1', 'Lot2', 'Lot3', 'Lot4', 'Lot5'],
        axisLine: {
          lineStyle: {
            color: 'rgba(245, 247, 248, 1)'
          }
        },
        axisLabel: {
          textStyle: { color: '#666' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(245, 247, 248, 1)'
          }
        }
      },
      series: [
        {
          data: [1, 3, 2, 4, 1],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: 'rgba(56, 158, 236, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(56, 158, 236, .6)'
                  }
                ],
                false
              )
            }
          }
        }
      ]
    })
    accuracyLotChart.on('click', params => this.onBarChartClick('LOT', monitor, params))
    // line chart
    // const accuracyLineChart = echarts.init(document.getElementById(`accuracy-line-${monitor.id}`))
    // accuracyLineChart.setOption({
    //   tooltip: {
    //     trigger: 'axis'
    //   },
    //   xAxis: {
    //     type: 'category',
    //     data: ['X1', 'X2', 'X3', 'X4', 'X5'],
    //     axisLine: {
    //       lineStyle: {
    //         color: 'rgba(245, 247, 248, 1)'
    //       }
    //     },
    //     axisLabel: {
    //       textStyle: { color: '#666' }
    //     }
    //   },
    //   yAxis: {
    //     type: 'value',
    //     axisLine: {
    //       show: false
    //     },
    //     axisTick: {
    //       show: false
    //     },
    //     splitLine: {
    //       show: true,
    //       lineStyle: {
    //         color: 'rgba(245, 247, 248, 1)'
    //       }
    //     }
    //   },
    //   series: [
    //     {
    //       data: [1, 3, 2, 4, 1],
    //       smooth: true,
    //       type: 'line',
    //       lineStyle: {
    //         color: 'rgba(39, 164, 73, 1)'
    //       },
    //       itemStyle: {
    //         color: 'rgba(39, 164, 73, 1)'
    //       }
    //     }
    //   ]
    // })
    // accuracyLineChart.on('click', params => this.onBarChartClick('Line', monitor, params))
    // // pie chart
    // const accuracyPieChart = echarts.init(document.getElementById(`accuracy-pie-${monitor.id}`))
    // accuracyPieChart.setOption({
    //   color: PIE_COLORS,
    //   legend: {
    //     type: 'scroll',
    //     bottom: 20,
    //     data: ['P1', 'P2', 'P3', 'P4', 'P5']
    //   },
    //   series: [
    //     {
    //       name: 'pie',
    //       type: 'pie',
    //       radius: '45%',
    //       center: ['50%', '50%'],
    //       data: [{ value: 335, name: 'P1' },
    //       { value: 310, name: 'P2' },
    //       { value: 274, name: 'P3' },
    //       { value: 235, name: 'P4' },
    //       { value: 400, name: 'P5' }]
    //     }
    //   ]
    // })
    // accuracyPieChart.on('click', params => this.onBarChartClick('pie', monitor, params))
  }

  onBarChartClick = (type, monitor, params) => {
    console.log('onBarChartClick', type, monitor, params.name, params.data)
    this.setState({ visible: true })
  }

  render() {
    const { models, model, monitors, viewBy } = this.state
    const { visible, images } = this.state
    return (
      <StyleReporting>
        <h3 className='ant-typography'>Reporting</h3>
        <StyleOverview>
          <h3>Overview</h3>
          <Row>
            <Col span={12} id='overview-chart-1' style={{ height: 300 }}></Col>
            <Col span={12} id='overview-chart-2' style={{ height: 300 }}></Col>
          </Row>
        </StyleOverview>
        <StyleModelsMonitor>
          <div className='filters'>
            <span>Select Model:</span>
            <Select style={{ width: 150, margin: '0 10px' }} defaultValue={model} onChange={this.onModelSelect}>
              {models.map(m => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
            <Button type='primary' onClick={this.onAddMonitoer}>
              Add to Monitor
            </Button>
            <Button type='primary' onClick={this.onRemoveMonitoer}>
              Remove from Monitor
            </Button>
            <span style={{ marginLeft: 40 }}>Data Range:</span>
            <Radio.Group defaultValue={viewBy} onChange={e => this.setState({ viewBy: e.target.value })}>
              <Radio value='LOT' style={{ marginLeft: 10 }} />
              <span>Last</span>
              <Input
                onChange={e => this.setState({ lots: e.target.value })}
                size='small'
                style={{ width: 40, margin: '0 5px' }}
              />
              <span>Lots</span>
              <Radio value='DAY' style={{ marginLeft: 20 }} />
              <span>Last</span>
              <Input
                onChange={e => this.setState({ days: e.target.value })}
                size='small'
                style={{ width: 40, margin: '0 5px' }}
              />
              <span>Days</span>
            </Radio.Group>
            <Button type='primary' style={{ marginLeft: 10 }}>
              Search
            </Button>
          </div>
          {monitors.map(monitor => (
            <StyleMonitor key={monitor.id}>
              {/* <Col span={1}>
                <h3>Step A ADC Model</h3>
              </Col> */}
              <Col span={8} style={{ paddingLeft: 15 }}>
                <h3>Step A ADC Model</h3>
                <h4>Overall Matrix</h4>
                <StyleTable>
                  <thead>
                    <tr>
                      <th width='100'>MB/ADC</th>
                      <th width='100'>Demount Residue</th>
                      <th width='100'>Oxide loss</th>
                      <th width='100'>Residue</th>
                      <th width='100'>Scratch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_DATA.map(r => (
                      <tr key={r.key}>
                        <td>{r.mb}</td>
                        <td onClick={() => this.onViewImages('matrix', r, 'dr')}>{r.dr}</td>
                        <td onClick={() => this.onViewImages('matrix', r, 'ol')}>{r.ol}</td>
                        <td onClick={() => this.onViewImages('matrix', r, 'r')}>{r.r}</td>
                        <td onClick={() => this.onViewImages('matrix', r, 's')}>{r.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </StyleTable>
              </Col>
              <Col span={8}>
                <h4>Accuracy% By Week</h4>
                <div style={{ width: '100%', height: 300 }} id={`accuracy-week-${monitor.id}`} />
              </Col>
              <Col span={8}>
                <h4>Accuracy% By Lot</h4>
                <div style={{ width: '100%', height: 300 }} id={`accuracy-lot-${monitor.id}`} />
              </Col>
              {/* <Col span={4}>
                <h4>Line Chart</h4>
                <div style={{ width: '100%', height: 300 }} id={`accuracy-line-${monitor.id}`} />
              </Col>
              <Col span={4}>
                <h4>Pie Chart</h4>
                <div style={{ width: '100%', height: 300 }} id={`accuracy-pie-${monitor.id}`} />
              </Col> */}
            </StyleMonitor>
          ))}
        </StyleModelsMonitor>

        <StyleImagesModal
          title='Images'
          visible={visible}
          width={1000}
          footer={null}
          onCancel={() => this.setState({ visible: false })}
        >
          <StyleImages className='gallery images'>
            {images.map(img => (
              <li key={img.id}>
                <img src={`http://161.189.50.41${img.url}`} alt='' />
              </li>
            ))}
          </StyleImages>
        </StyleImagesModal>
      </StyleReporting>
    )
  }
}

// injectReducer('Builder', reducer)
const mapDispatchToProps = { changeMenu, changeToolboxLoading }
export default connect(() => ({}), mapDispatchToProps)(Reporting)
