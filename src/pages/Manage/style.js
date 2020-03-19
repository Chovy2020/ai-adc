import styled from 'styled-components'
import { Row, Col } from 'antd'

export const StyleManagement = styled.div`
  margin: 0;
  padding: 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
`

export const StyleGroup = styled.div`
  width: 100%;
  min-height: 70px;
  border-radius: 3px;
  padding: 20px;
  border: 1px solid #ddd;
  margin-top: 20px;
`

export const StyleModel = styled(Row)`
  width: 100%;
  margin-top: 20px;
  .ant-col:first-child {
    line-height: 24px;
    font-size: 12px;
    font-weight: bold;
  }
  .log {
    text-align: center;
  }
  button {
    width: 40px;
    min-width: 40px;
    text-align: center;
    padding: 0;
  }
  .action button {
    min-width: 24px;
    width: 24px;
    margin: 0 5px;
    border: none;
    &.ant-btn-default {
      background-color: #97cdf4;
    }
    &.ant-btn-primary {
      background-color: #48d1cc;
    }
    &.ant-btn-danger {
      background-color: #ffdead;
    }
    &.ant-btn-dashed {
      background-color: #d8d8d8;
    }
  }
`

export const StyleLifecycle = styled(Col)`
  height: 24px;
  position: relative;
  &.ant-col-18 {
    display: flex;
  }
  span {
    min-width: 10px;
  }
  .time {
    position: absolute;
    line-height: 24px;
    font-size: 12px;
    right: 2px;
    color: #666;
  }
  .Training {
    background-color: #97cdf4;
  }
  .Pirun {
    background-color: #ffdead;
  }
  .Production {
    background-color: #48d1cc;
  }
  .Disable {
    background-color: #d8d8d8;
  }
`
