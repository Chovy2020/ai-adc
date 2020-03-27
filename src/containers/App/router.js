import React from 'react'
import { connect } from 'react-redux'
import { Spin, Popover, Avatar } from 'antd'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { changeMenu, changeUser } from '@/utils/action'
import { generateModules } from '@/utils/web'
import { COMMON_ROUTES } from '@/utils/constant'
import { StyleHeader, StyleLogo, StyleContainer, StyleMenu, StyleUser } from './style'
import Home from '@/pages'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      routes: []
    }
  }
  // 初始化
  componentDidMount() {
    let user = localStorage.getItem('AI_ADC_USER')
    if (!user) {
      this.props.changeUser(null)
      return
    }
    user = JSON.parse(user)
    this.props.changeUser(user)
    // 根据user.buttons生成routes
    let routes = generateModules(user)
    // Header增加Home
    routes.unshift({
      title: 'Home',
      link: '/',
      page: Home
    })
    this.setState({ routes })
  }

  onChangeMenu = link => {
    this.props.changeMenu(link.substr(1))
  }

  onLogout = () => {
    localStorage.removeItem('AI_ADC_TOKEN')
    localStorage.removeItem('AI_ADC_USER')
    window.location.href = '/login'
  }

  render() {
    const { toolBoxLoading, activeMenu, user } = this.props
    const { routes } = this.state

    return (
      <BrowserRouter>
        <StyleHeader>
          <Link to='/'>
            <StyleLogo>AI ADC</StyleLogo>
          </Link>
          {user ? (
            <>
              <StyleMenu>
                {routes.map(m => (
                  <li key={m.link}>
                    <Link
                      className={`/${activeMenu}` === m.link ? 'active' : ''}
                      onClick={() => this.onChangeMenu(m.link)}
                      to={m.link}
                    >
                      {m.title}
                    </Link>
                  </li>
                ))}
              </StyleMenu>
              <StyleUser>
                <Popover
                  placement='bottomRight'
                  content={
                    <>
                      <p>{user.nickName}</p>
                      <p onClick={this.onLogout}>Logout</p>
                    </>
                  }
                  trigger='click'
                >
                  <Avatar style={{ backgroundColor: '#fff', color: '#333' }} icon='user' />
                </Popover>
              </StyleUser>
            </>
          ) : null}
        </StyleHeader>
        <StyleContainer>
          <Spin size='large' spinning={toolBoxLoading}>
            <Switch>
              {COMMON_ROUTES.map(r => (
                <Route key={r.link} exact path={r.link} component={r.page} />
              ))}
              {user ? (
                <>
                  {routes.map(r => (
                    <Route key={r.link} exact path={r.link} component={r.page} />
                  ))}
                </>
              ) : (
                <Redirect to='/login' />
              )}
              <Redirect from='*' to='/404' />
            </Switch>
          </Spin>
        </StyleContainer>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Init.user,
  toolBoxLoading: state.Init.toolBoxLoading,
  activeMenu: state.Init.activeMenu
})
const mapDispatchToProps = { changeMenu, changeUser }
export default connect(mapStateToProps, mapDispatchToProps)(App)
