import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin, Popover } from 'antd'
import { changeMenu, changeUser } from '@/utils/action'
import { StyleHeader, StyleLogo, StyleContainer, StyleMenu, StyleUser } from './style'
import { MODULES } from '@/utils/constant'

// ADC Common Pages
import Home from '@/pages'
import Login from '@/pages/Account/Login/Loadable'
import Page404 from '@/pages/Account/404'

const COMMON_ROUTES = [
  {
    link: '/',
    page: Home
  },
  {
    link: '/login',
    page: Login
  }
]

const modules = _.cloneDeep(MODULES)
modules.unshift({
  title: 'Home',
  link: '/'
})

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      customModules: []
    }
  }

  componentDidMount() {
    this.onInit()
  }

  onChangeMenu = link => {
    this.props.changeMenu(link.substr(1))
  }

  onInit = () => {
    console.log('onInit')
  }

  render() {
    const { toolBoxLoading, activeMenu } = this.props

    let CUSTOM_MODULES = []
    let user = localStorage.getItem('AI_ADC_USER')
    let isLogged = true
    if (user) {
      user = JSON.parse(user)
      let customRoutes = []
      for (const str of user.buttons) {
        const perm = str.split(':')
        if (perm[2] === 'view' && !customRoutes.includes(perm[1])) {
          customRoutes.push(perm[1])
        }
      }
      customRoutes = customRoutes.map(route => `/${route}`)
      CUSTOM_MODULES = MODULES.filter(route => customRoutes.includes(route.link))
      // CUSTOM_MODULES = CUSTOM_MODULES.filter((item, index) => index < 3)
    } else isLogged = false

    console.log('isLogged', isLogged, CUSTOM_MODULES.length)

    return (
      <BrowserRouter>
        <StyleHeader>
          <Link to='/'>
            <StyleLogo>AI ADC</StyleLogo>
          </Link>
          <StyleMenu>
            {modules.map(m => (
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
            {isLogged ? (
              <Popover placement='bottomRight' content={<Link to='/login'>Logout</Link>} trigger='click'>
                <b>{user.nickName}</b>
              </Popover>
            ) : (
              <Link to='/login'>
                <b>Login</b>
              </Link>
            )}
          </StyleUser>
        </StyleHeader>
        <StyleContainer>
          <Spin size='large' spinning={toolBoxLoading}>
            <Switch>
              {COMMON_ROUTES.map(r => (
                <Route key={r.link} exact={r.link === '/'} path={r.link} component={r.page} />
              ))}
              <Route path='/404' component={Page404} />
              {isLogged ? (
                <>
                  {CUSTOM_MODULES.map(r => (
                    <Route key={r.link} exact={r.link === '/'} path={r.link} component={r.page} />
                  ))}
                </>
              ) : (
                <Redirect to='/login' />
              )}
              <Redirect form='/*' to='/404' />
            </Switch>
          </Spin>
        </StyleContainer>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({
  toolBoxLoading: state.Init.toolBoxLoading,
  activeMenu: state.Init.activeMenu,
  permissions: state.Init.permissions
})
const mapDispatchToProps = { changeMenu, changeUser }
export default connect(mapStateToProps, mapDispatchToProps)(App)
