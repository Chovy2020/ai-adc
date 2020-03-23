import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Spin, Popover, Button } from 'antd'
import { changeMenu, changeUser } from '@/utils/action'
import { StyleLayout } from './style'
import { MODULES } from '@/utils/constant'

class Layout extends React.Component {
  render() {
    const { content } = this.props

    return (
      <StyleLayout>
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
        <StyleContainer content={content} />
      </StyleLayout>
    )
  }
}

export default Layout
