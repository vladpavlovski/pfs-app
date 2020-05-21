import Context from './Context'
import React from 'react'
import config from '../../config'

const withAppConfigs = Component => props => (
  <Context.Consumer>
    {value => {
      const { appConfig } = value || {}
      return <Component appConfig={{ ...config, ...appConfig }} {...props} />
    }}
  </Context.Consumer>
)

export default withAppConfigs
