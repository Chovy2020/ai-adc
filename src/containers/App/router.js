import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Icon } from 'antd'
import { Header, Logo, Container, Menu, Main } from './style'
import { changeMenu } from '@/utils/action'
import { MENUS } from '@/utils/constant'

// Router
import HomePage from '@/pages'

const routes = {
  '/': HomePage,
  // '/*': Page404
}

const generateRoute = (route, key) => <Route key={key} exact={route === '/'} path={route} component={routes[route]} />

class App extends React.Component {
  componentDidMount() {
    const path = window.location.pathname || ''
    let activeMenu = 'toolbox'
    for (const menu of MENUS) {
      if (path.indexOf(menu.link) >= 0) {
        activeMenu = menu.link
      }
    }
    this.props.changeMenu(activeMenu)
  }

  onMenuChange = activeMenu => {
    this.props.changeMenu(activeMenu)
  }

  render() {
    const { activeMenu } = this.props

    return (
      <BrowserRouter>
        <Header>
          <Logo>Aurora AI Defect</Logo>
        </Header>
        <Container>
          <Menu>
            <ul>
              {MENUS.map(m => (
                <li
                  onClick={() => this.onMenuChange(m.link)}
                  className={activeMenu === m.link ? 'active' : ''}
                  key={m.link}
                >
                  <Link to={m.link}>
                    <Icon type={m.icon} />
                    <span>{m.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Menu>
          <Main>
            <Switch>
              {Object.keys(routes).map((route, key) => generateRoute(route, key))}
              <Route exact path='' component={HomePage} />
              <Redirect form='/*' to='/404' />
            </Switch>
          </Main>
        </Container>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({ ...state.Init })
const mapDispatchToProps = { changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(App)