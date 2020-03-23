import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { setLoginRedirectUrl } from '../actions/loginAction'

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props
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
      CUSTOM_MODULES.push({
        link: '/',
        page: Home
      })
    } else isLogged = false

    console.log('isLogged', isLogged)

    return (
      <Route
        {...rest}
        render={props => {
          return isLogged ? <Component {...props} /> : <Redirect to='/login' />
        }}
      />
    )
  }
}

export default AuthorizedRoute
