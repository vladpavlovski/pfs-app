import PropTypes from 'prop-types'
import DrawerContent from './DrawerContent'
import DrawerHeader from './DrawerHeader'
import React from 'react'
import ResponsiveDrawer from '../../containers/ResponsiveDrawer'
import { withAppConfigs } from '../../contexts/AppConfigProvider'
import { withRouter } from 'react-router-dom'

const Drawer = ({ history, appConfig }) => {
  const path = history.location.pathname
  const Header = appConfig.drawerHeader ? appConfig.drawerHeader : DrawerHeader

  return (
    <ResponsiveDrawer>
      <Header />
      <DrawerContent path={path} history={history} />
    </ResponsiveDrawer>
  )
}

Drawer.propTypes = {
  appConfig: PropTypes.shape({
    drawerHeader: PropTypes.any,
  }),
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.any,
    }),
  }),
}

export default withRouter(withAppConfigs(Drawer))
