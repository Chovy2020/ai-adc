import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin } from 'antd'
import { Header, Logo, Container, StyleMenu } from './style'
import { MODULES } from '@/utils/constant'

// ADC
import Home from '@/pages'
import Manual from '@/pages/Manual/Loadable'
import Library from '@/pages/Library/Loadable'
import Builder from '@/pages/Builder/Loadable'
import Config from '@/pages/Config/Loadable'
import Reporting from '@/pages/Reporting/Loadable'

// Account
import Page404 from '@/pages/Account/404'

const routes = {
  '/': Home,
  '/manual': Manual,
  '/library': Library,
  '/builder': Builder,
  '/config': Config,
  '/reporting': Reporting,
  '/*': Page404
}
const modules = _.cloneDeep(MODULES)
modules.unshift({
  title: 'Home',
  link: ''
})

const generateRoute = (route, key) => <Route key={key} exact={route === '/'} path={route} component={routes[route]} />

class App extends React.Component {
  render() {
    const { toolBoxLoading, activeMenu } = this.props

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
              {Object.keys(routes).map((route, key) => generateRoute(route, key))}
              <Route exact path='' component={Home} />
              <Redirect form='/*' to='/404' />
            </Switch>
          </Spin>
        </Container>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({ ...state.Init })
export default connect(mapStateToProps, {})(App)
