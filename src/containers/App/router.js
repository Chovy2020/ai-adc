import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin } from 'antd'
import { Header, Logo, Container, StyleMenu } from './style'
import { MODULES } from '@/utils/constant'

// ADC
import Home from '@/pages'
import Classification from '@/pages/Classification/Loadable'
import Library from '@/pages/Library/Loadable'
import Builder from '@/pages/Builder/Loadable'
import Config from '@/pages/Config/Loadable'
import Reporting from '@/pages/Reporting/Loadable'

// Account
import Page404 from '@/pages/Account/404'

const MODULE_ROUTES = [
  {
    route: '/classification',
    page: Classification
  },
  {
    route: '/library',
    page: Library
  },
  {
    route: '/builder',
    page: Builder
  },
  {
    route: '/config',
    page: Config
  },
  {
    route: '/reporting',
    page: Reporting
  }
]
const STATIC_ROUTES = [
  {
    route: '/',
    page: Home
  },
  {
    route: '/*',
    page: Page404
  }
]

const modules = _.cloneDeep(MODULES)
modules.unshift({
  title: 'Home',
  link: ''
})

class App extends React.Component {
  render() {
    const { toolBoxLoading, activeMenu, customRoutes } = this.props
    const routes = [...MODULE_ROUTES.filter(r => customRoutes.includes(r.route)), ...STATIC_ROUTES]

    return (
      <BrowserRouter>
        <Header>
          <Link to='/'>
            <Logo>AI ADC</Logo>
          </Link>
          <StyleMenu>
            {modules.map(m => (
              <li key={m.link}>
                <Link className={activeMenu === m.link ? 'active' : ''} to={m.link}>
                  {m.title}
                </Link>
              </li>
            ))}
          </StyleMenu>
        </Header>
        <Container>
          <Spin size='large' spinning={toolBoxLoading} style={{ height: 'calc(100vh - 50px)' }}>
            <Switch>
              {routes.map(r => (
                <Route key={r.route} exact={r.route === '/'} path={r.route} component={r.page} />
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
