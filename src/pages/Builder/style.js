import styled from 'styled-components'
import { Modal } from 'antd'

export const StyleBuilder = styled.div`
  margin: 0;
  padding: 0;
  height: calc(100vh - 50px);
  .ant-row,
  .ant-col {
    height: 100%;
  }
  .ant-col {
    padding: 5px;
  }
`

export const StyleToolsGroup = styled.div`
  h4 {
    background-color: #eee;
    margin-top: 10px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    li {
      width: 33.33%;
      text-align: center;
      padding: 5px 0;
      .anticon {
        font-size: 24px;
        padding: 4px;
        &:hover {
          color: #1c92ed;
          cursor: pointer;
        }
      }
    }
  }
`

export const StyleImagesContainer = styled.div`
  padding: 10px 0;
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
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


export const StyleImagesModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
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


export const StyleModelContainer = styled.div`
  padding: 10px 0;
  width: 100%;
  margin-top: 10px;
  .ant-row {
    width: 80%;
  }
  .ant-col {
    text-align: center;
  }
  .model-icon {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  .model-block {
    border: 1px solid #ccc;
    min-height: 200px;
  }
  h4 {
    margin: 0;
    padding: 8px;
  }
`

export const StyleModelList = styled.ul`
  display: block;
  width: 100%;
  padding: 10px;
  height: 100%;
  li button {
    text-align: left;
    width: 180px;
  }
  li + li {
    margin-top: 10px;
  }
  button.config {
    background-color: green;
    border: none;
  }
`