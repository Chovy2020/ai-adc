import styled from 'styled-components'
import Logo from '@/assets/images/logo.png'

export const StyleHeader = styled.header`
  background: linear-gradient(90deg, #53a0fd, #5bd7d8);
  height: 50px;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  line-height: 50px;
  padding: 0 20px;
`

export const StyleLogo = styled.div`
  font-size: 22px;
  font-family: TrajanPro-Bold, TrajanPro;
  background: url(${Logo}) 0 center no-repeat;
  background-size: 75px auto;
  padding-left: 90px;
  color: #fff;
  float: left;
`

export const StyleContainer = styled.div`
  .ant-spin-container {
    height: calc(100vh - 50px);
  }
`

export const StyleMenu = styled.ul`
  float: left;
  margin-left: 100px;
  height: 100%;
  li {
    float: left;
    a {
      color: #fff;
      padding: 10px 30px;
      font-size: 14px;
      line-height: 30px;
      display: block;
      &.active {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
`

export const StyleUser = styled.div`
  flex: 1;
  text-align: right;
  b {
    color: #00f;
    :hover {
      cursor: pointer;
    }
  }
`
export const StyleLayout = styled.div`
  width: 100%;
  height: 100%;
`