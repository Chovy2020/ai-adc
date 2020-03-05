import styled from 'styled-components'
import { Modal } from 'antd'

export const StyleLibrary = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
`

export const StyleChoose = styled.div`
  height: 80px;
  padding: 10px;
  width: 100%;
  .ant-form-item {
    margin-bottom: 0;
  }
`

export const StyleContainer = styled.div`
  width: 100%;
  height: calc(100vh - 130px);
  .function {
    height: 100%;
    border-left: 1px solid #eee;
    padding: 10px 20px;
    button {
      width: 100%;
      margin: 10px 0;
    }
  }
`

export const StyleImagesGroup = styled.div`
  width: 100%;
  margin-top: 8px;
  h3 {
    padding: 0;
    margin: 0;
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
    width: 16.6%;
    height: calc(100vw / 6);
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
  &.gallery.images li img {
    height: 100%;
  }
`

export const StyleDefectInfo = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`

export const StyleImagesModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
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
