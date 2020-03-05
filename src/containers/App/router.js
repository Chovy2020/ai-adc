import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin } from 'antd'
import { Header, Logo, Container } from './style'

// ADC
import Home from '@/pages'
import Manual from '@/pages/Manual/Loadable'
import Library from '@/pages/Library/Loadable'

// Account
import Page404 from '@/pages/Account/404'

const routes = {
  '/': Home,
  '/manual': Manual,
  '/library': Library,
  '/*': Page404
}

const generateRoute = (route, key) => <Route key={key} exact={route === '/'} path={route} component={routes[route]} />

class App extends React.Component {
  render() {
    const { toolBoxLoading } = this.props

    return (
      <BrowserRouter>
        <Header>
          <Link to='/'>
            <Logo>AI ADC</Logo>
          </Link>
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
