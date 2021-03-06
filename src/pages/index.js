import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { changeMenu } from '@/utils/action'
import { generateModules } from '@/utils/web'

const StyleModuleContainer = styled.div`
  background-color: #f3f9fb;
  width: 100%;
  height: calc(100vh - 50px);
  padding-top: 150px;
  & > ul {
    list-style: none;
    width: 960px;
    margin: 0 auto;
    padding: 0;
  }
  li {
    width: 300px;
    height: 160px;
    margin: 10px;
    float: left;
  }
`
const StyleModule = styled(Link)`
  display: block;
  text-align: center;
  width: 100%;
  font-size: 16px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 30px 0 0;
  &:hover {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  }
  img {
    margin: 0 auto 20px;
  }
`

class ADC extends React.Component {
  componentDidMount() {
    this.props.changeMenu('')
  }

  onChangeMenu = link => {
    this.props.changeMenu(link.substr(1))
  }

  render() {
    const { user } = this.props

    return (
      <StyleModuleContainer>
        <ul>
          {generateModules(user).map(m => (
            <li key={m.title}>
              <StyleModule to={m.link} onClick={() => this.onChangeMenu(m.link)}>
                <img src={m.icon} alt='' />
                <h3>{m.title}</h3>
              </StyleModule>
            </li>
          ))}
        </ul>
      </StyleModuleContainer>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Init.user
})
const mapDispatchToProps = { changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(ADC)
