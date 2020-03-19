import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin } from 'antd'
import { Header, Logo, Container, StyleMenu } from './style'
import { MODULES } from '@/utils/constant'

// ADC Common Pages
import Home from '@/pages'
import Page404 from '@/pages/Account/404'

const COMMON_ROUTES = [
  {
    link: '/',
    page: Home
  },
  {
    link: '/*',
    page: Page404
  }
]

const modules = _.cloneDeep(MODULES)
modules.unshift({
  title: 'Home',
  link: '/'
})

class App extends React.Component {
  render() {
    const { toolBoxLoading, activeMenu, customRoutes } = this.props
    const CUSTOM_ROUTES = [...MODULES.filter(route => customRoutes.includes(route.link)), ...COMMON_ROUTES]

    return (
      <BrowserRouter>
        <Header>
          <Link to='/'>
            <Logo>AI ADC</Logo>
          </Link>
          <StyleMenu>
            {modules.map(m => (
              <li key={m.link}>
                <Link className={`/${activeMenu}` === m.link ? 'active' : ''} to={m.link}>
                  {m.title}
                </Link>
              </li>
            ))}
          </StyleMenu>
        </Header>
        <Container>
          <Spin size='large' spinning={toolBoxLoading} style={{ height: 'calc(100vh - 50px)' }}>
            <Switch>
              {CUSTOM_ROUTES.map(r => (
                <Route key={r.link} exact={r.link === '/'} path={r.link} component={r.page} />
              ))}
              <Route exact path='' component={Home} />
              <Redirect form='/*' to='/404' />
            </Switch>
          </Spin>
        </Container>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({
  toolBoxLoading: state.Init.toolBoxLoading,
  activeMenu: state.Init.activeMenu,
  customRoutes: state.Init.customRoutes
})
export default connect(mapStateToProps, {})(App)
