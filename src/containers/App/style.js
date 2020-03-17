import styled from 'styled-components'
import logo from '@/assets/images/logo.png'

export const Header = styled.header`
  background: linear-gradient(90deg, #53A0FD, #5BD7D8);
  height: 50px;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  line-height: 50px;
  padding: 0 20px;
`

export const Logo = styled.div`
  font-size: 22px;
  font-family: TrajanPro-Bold, TrajanPro;
  background: url(${logo}) 0 center no-repeat;
  background-size: 75px auto;
  padding-left: 90px;
  color: #fff;
  float: left;
`

export const Container = styled.div`
  height: calc(100vh - 50px);
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
