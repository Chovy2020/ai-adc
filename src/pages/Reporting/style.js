import styled from 'styled-components'
import { Row, Modal } from 'antd'

export const StyleReporting = styled.div`
  margin: 0;
  padding: 10px;
  height: calc(100vh - 50px);
  overflow-y: auto;
`

export const StyleOverview = styled.div`
  margin: 0;
  padding: 10px;
  height: 320px;
  border: 1px solid #ddd;
`

export const StyleModelsMonitor = styled.div`
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ddd;
`

export const StyleMonitor = styled(Row)`
  width: 100%;
  height: 400px;
  padding: 10px;
  margin-top: 10px;
  border-top: 1px solid #ddd;
  .ant-col-1 {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
  }
  h3 {
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    height: 250px;
    text-align: center;
  }
  h4 {
    text-align: center;
  }
`

export const StyleTable = styled.table`
  border-collapse: separate;
  border-spacing: 3px;
  th,
  td {
    border: 1px solid #eee;
    padding: 5px;
    height: 54px;
  }
  tr td {
    text-align: center;
    &:first-child {
      text-align: left;
    }
  }
  th {
    background-color: #389eec;
    color: #fff;
  }
  td {
    background-color: #dcebf9;
  }
  td:hover {
    opacity: 0.5;
    cursor: pointer;
  }
  tbody tr:nth-child(1) td:nth-child(2),
  tbody tr:nth-child(2) td:nth-child(3),
  tbody tr:nth-child(3) td:nth-child(4),
  tbody tr:nth-child(4) td:nth-child(5) {
    background-color: #93d047;
  }
`

export const StyleImagesModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
    min-height: 100px;
    max-height: 450px;
    overflow-y: auto;
  }
  .ant-breadcrumb {
    padding: 0 10px;
  }
  .ant-breadcrumb-link {
    color: #1890ff;
    cursor: pointer;
  }
  .ant-breadcrumb span:last-child .ant-breadcrumb-link {
    color: rgba(0, 0, 0, 0.65);
    cursor: default;
  }
`

export const StyleImages = styled.ul`
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  box-sizing: border-box;
  display: flex;
  list-style: none;
  margin-bottom: 0;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 5px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border: 2px solid transparent;
      padding: 2px;
    }
    &.selected img {
      border-color: red;
    }
    .wafer-info {
      position: absolute;
      left: 12px;
      bottom: 10px;
      color: #0f0;
      font-size: 12px;
      p {
        margin: 0;
        line-height: 1.5;
      }
      &.font-size-12 p {
        font-size: 12px;
      }
      &.font-size-14 p {
        font-size: 14px;
      }
      &.font-size-16 p {
        font-size: 16px;
      }
      &.font-size-18 p {
        font-size: 18px;
      }
    }
  }
  &.col6 li {
    width: 16.66%;
    height: calc((100vw - 10px) / 6);
  }
  &.gallery li {
    width: 120px;
    height: 120px;
    display: block;
    img {
      height: 90px;
    }
    p {
      line-height: 20px;
      margin: 0;
      text-align: center;
    }
  }
  &.images li {
    width: 120px;
    height: 120px;
    display: block;
    img {
      height: 110px;
    }
  }
`
