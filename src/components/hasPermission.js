import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  permissions: state.Init.permissions
})

const checkAuth = (permissions, auth) => {
  console.log('permissions', permissions)
  console.log('auth', auth)
  return permissions.includes(auth)
}

const hasPermission = Component =>
  connect(
    mapStateToProps,
    {}
  )(
    class WrapComponent extends React.Component {
      render() {
        const { permissions, auth } = this.props
        return checkAuth(permissions, auth) ? <Component {...this.props} /> : null
      }
    }
  )

export default hasPermission
