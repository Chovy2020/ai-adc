import React from 'react'
import echarts from 'echarts'
import { connect } from 'react-redux'
import { Row, Col, Button, Input, Checkbox, Select } from 'antd'
import { changeMenu } from '@/utils/action'
import { delay } from '@/utils/web'
import { LIBRARY } from '@/pages/Builder/constant'
import { TABLE_DATA } from './constant'
import {
  StyleReporting,
  StyleOverview,
  StyleModelsMonitor,
  StyleMonitor,
  StyleTable,
  StyleImagesModal,
  StyleImages
} from './style'

class Reporting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overviewChart1: null,
      overviewChart2: null,
      // data range
      lastLots: false,
      lots: '',
      lastDays: false,
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

  componentDidMount() {
    this.props.changeMenu('reporting')
    const overviewChart1 = echarts.init(document.getElementById('overview-chart-1'))
    const overviewChart2 = echarts.init(document.getElementById('overview-chart-2'))
    this.setState({ overviewChart1, overviewChart2 })
    this.renderMonitors()
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
      xAxis: {
        type: 'category',
        data: ['WWK1', 'WWK2', 'WWK3', 'WWK4', 'WWK5']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [12, 20, 15, 8, 7],
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      ]
    })
    accuracyWeekChart.on('click', params => this.onBarChartClick('WEEK', monitor, params))
    const accuracyLotChart = echarts.init(document.getElementById(`accuracy-lot-${monitor.id}`))
    accuracyLotChart.setOption({
      xAxis: {
        type: 'category',
        data: ['Lot1', 'Lot2', 'Lot3', 'Lot4', 'Lot5']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [1, 3, 2, 4, 1],
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      ]
    })
    accuracyLotChart.on('click', params => this.onBarChartClick('LOT', monitor, params))
  }

  onBarChartClick = (type, monitor, params) => {
    console.log('onBarChartClick', type, monitor, params.name)
    this.setState({ visible: true })
  }

  render() {
    const { models, model, monitors } = this.state
    const { overviewChart1, overviewChart2, visible, images } = this.state
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
            <Checkbox onChange={e => this.setState({ lastLots: e.target.checked })} style={{ marginLeft: 10 }} />
            <span>Last</span>
            <Input
              onChange={e => this.setState({ lots: e.target.value })}
              size='small'
              style={{ width: 40, margin: '0 5px' }}
            />
            <span>Lots</span>
            <Checkbox onChange={e => this.setState({ lastDays: e.target.checked })} style={{ marginLeft: 20 }} />
            <span>Last</span>
            <Input
              onChange={e => this.setState({ days: e.target.value })}
              size='small'
              style={{ width: 40, margin: '0 5px' }}
            />
            <span>Days</span>
            <Button type='primary' style={{ marginLeft: 10 }}>
              Search
            </Button>
          </div>
          {monitors.map(monitor => (
            <StyleMonitor key={monitor.id}>
              <Col span={1}>
                <h3>Step A ADC Model</h3>
              </Col>
              <Col span={7}>
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
const mapDispatchToProps = { changeMenu }
export default connect(() => ({}), mapDispatchToProps)(Reporting)
