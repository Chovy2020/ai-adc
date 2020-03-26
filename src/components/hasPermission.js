import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.Init.user
})

const checkAuth = (permissions, auth) => {
  return permissions.includes(auth)
}

const hasPermission = Component =>
  connect(
    mapStateToProps,
    {}
  )(
    class WrapComponent extends React.Component {
      render() {
        const { user, auth } = this.props
        const permissions = user ? user.buttons : []
        return checkAuth(permissions, auth) ? <Component {...this.props} /> : null
      }
    }
  )

export default hasPermission
