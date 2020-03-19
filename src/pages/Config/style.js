import styled from 'styled-components'
import { Modal } from 'antd'

export const StyleConfig = styled.div`
  margin: 0;
  padding: 0 20px 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
`

export const StyleModelGroup = styled.div`
  .ant-table p {
    margin: 0;
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

export const StyleEditModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px 20px 10px;
  }
`
