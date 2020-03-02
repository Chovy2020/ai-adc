import styled from 'styled-components'
import { Card, List } from 'antd'

export const StyleManual = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  .ant-form-vertical .ant-form-item {
    margin-bottom: 0;
    &:last-child {
      padding-bottom: 0;
    }
  }
`

export const StyleDataQuery = styled.div`
  width: 100%;
  padding: 8px;
  border-bottom: 1px dotted #ccc;
`

export const DragContainer = styled.div`
  width: calc((100vw - 80px - 40px - 20px * 2) * 22 / 24 - 20px);
  height: 250px;
  background-color: #f3f3f3;
  overflow-x: auto;
  display: flex;
  margin: 0;
  padding: 5px;
  white-space: nowrap;
  border: 1px solid #efefef;
  [data-rbd-drag-handle-context-id='0'] {
    cursor: default;
  }
`
export const DragItem = styled.div`
  margin: 5px;
  user-select: none;
  padding: 0;
  &:last-child {
    margin-right: 10px;
  }
`
export const DragCard = styled(Card)`
  width: 200px;
  height: 226px;
  .ant-card-body {
    padding: 5px;
  }
  h4 {
    margin-bottom: 5px;
  }
  button {
    min-width: 40px;
  }
`
export const DragList = styled(List)`
  padding: 2px 0;
  .ant-list-items {
    overflow-y: auto;
    margin-top: 3px;
    height: 167px;
  }
  p {
    margin: 0;
    font-size: 12px;
    cursor: default;
    &.active {
      font-weight: bold;
      background-color: #409eff50;
    }
  }
  p + p {
    margin-top: 1px;
  }
`

export const StyleContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 600px;
  display: flex;
  .image {
    flex: 1;
    padding: 8px;
    .ant-form {
      padding: 0 10px;
    }
  }
  .drawer {
    width: 250px;
    padding: 10px;
    border-left: 1px solid #ccc;
  }
  img {
    width: 100px;
    height: 100px;
    display: block;
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
  &.col3 li {
    width: 33.33%;
    height: calc((100vw - 80px - 40px - 20px * 2 - 220px) / 3);
  }
  &.col4 li {
    width: 25%;
    height: calc((100vw - 80px - 40px - 20px * 2 - 220px) / 4);
  }
  &.col5 li {
    width: 20%;
    height: calc((100vw - 80px - 40px - 20px * 2 - 220px) / 5);
  }
`
