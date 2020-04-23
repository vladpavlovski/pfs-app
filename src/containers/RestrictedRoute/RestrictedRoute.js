import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

export const RestrictedRoute = ({
  type,
  isAuthorised,
  component: Component,
  fallbackComponent: FallbackComponent = false,
  ...rest
}) => (
  <Route
    {...rest}
    render={params => {
      if (
        (isAuthorised && type === 'private') ||
        (!isAuthorised && type === 'public')
      ) {
        return <Component {...params} />
      } else if (FallbackComponent) {
        return <FallbackComponent {...params} />
      } else {
        return (
          <Redirect
            to={{
              pathname:
                type === 'private'
                  ? '/signin'
                  : params.location.state
                  ? params.location.state.from.pathname
                  : '/',
              search: `from=${params.location.pathname}`,
              state: { from: params.location },
            }}
          />
        )
      }
    }}
  />
)

RestrictedRoute.propTypes = {
  component: PropTypes.any,
  fallbackComponent: PropTypes.bool,
  isAuthorised: PropTypes.any,
  type: PropTypes.string,
}

const mapStateToProps = ({ auth }) => ({
  isAuthorised: auth.isAuthorised,
})

export default connect(mapStateToProps)(RestrictedRoute)
