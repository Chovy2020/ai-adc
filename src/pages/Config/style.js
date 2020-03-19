import styled from 'styled-components'
// import { Modal } from 'antd'

export const StyleConfig = styled.div`
  margin: 0;
  padding: 0 20px 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
`

export const StyleModelGroup = styled.div``

export const StyleGroupConfigure = styled.div`
  border: 1px solid #ddd;
  margin-top: 20px;
  padding-bottom: 20px;
  h4 {
    padding-left: 20px;
    margin: 10px 0;
  }
`
export const StyleGroupTableContainer = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  flex-wrap: wrap;
`
export const StyleGroupTable = styled.div`
  width: 31%;
  margin: 10px 2% 10px 0;
  flex-wrap: wrap;
  border: 1px solid #ddd;
  padding: 2px;
  &.active {
    border: 1px solid #f00;
  }
  .editable-cell {
    position: relative;
  }
  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }
  .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }
`

export const StyleHotkeys = styled.div`
  .ant-list-items {
    padding: 0 5px;
    margin-top: 20px;
  }
  .ant-list-item {
    padding: 5px 0;
  }
`
